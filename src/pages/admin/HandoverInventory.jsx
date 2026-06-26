import React, { useState, useEffect, useRef } from 'react';
import orderApi from '../../api/orderApi';
import { 
  Search, 
  Trash2, 
  ArrowLeft,
  Check,
  UploadCloud,
  FileText,
  AlertTriangle,
  FileCheck,
  HelpCircle,
  X,
  Info,
  Calendar,
  User,
  Wrench,
  CheckCircle
} from 'lucide-react';

const formatVND = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export default function HandoverInventory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const returnImagesInputRef = useRef(null);
  const [uploadingReturnImages, setUploadingReturnImages] = useState(false);
  const [uploadedReturnImageUrls, setUploadedReturnImageUrls] = useState([]);

  // Mapper cho danh sách thanh lý
  const mapLiquidation = (o) => ({
    id: o.id,
    orderCode: o.ma_don || o.orderCode || '',
    customerName: o.khach_hang?.ho_ten || o.customerName || 'Khách hàng',
    customerEmail: o.khach_hang?.email || o.customerEmail || '',
    customerPhone: o.khach_hang?.so_dien_thoai || o.customerPhone || '',
    expectedReturnDate: o.ngay_tra?.split('T')[0] || o.expectedReturnDate || '',
    receiveDate: o.ngay_nhan?.split('T')[0] || o.receiveDate || '',
    depositAmount: Number(o.tong_tien_coc || o.depositAmount) || 0,
    orderStatus: o.trang_thai || o.orderStatus || 'DANG_THUE',
    liquidationStatus: o.phieu_tra?.id ? 'Đã thanh lý' : 'Chờ thanh lý',
  });

  // Helper to match physical assets to their product models by name/code heuristics
  const findMatchingChiTiet = (tb, chiTietList) => {
    if (!chiTietList || chiTietList.length === 0) return null;
    const code = (tb.ma_tai_san || '').toLowerCase();
    const serial = (tb.so_serial || '').toLowerCase();

    // DJI RS 4 Pro -> TS-RS4-001, RS4
    if (code.includes('rs4') || serial.includes('rs4') || code.includes('dji') || serial.includes('dji')) {
      const match = chiTietList.find(ct => {
        const name = (ct.ten_mau || '').toLowerCase();
        return name.includes('rs4') || name.includes('rs 4') || name.includes('dji');
      });
      if (match) return match;
    }

    // Sony FE 24-70mm -> TS-2470-001, LENS
    if (code.includes('2470') || serial.includes('2470') || code.includes('24-70') || serial.includes('24-70')) {
      const match = chiTietList.find(ct => {
        const name = (ct.ten_mau || '').toLowerCase();
        return name.includes('24-70') || name.includes('2470');
      });
      if (match) return match;
    }

    // Sony Alpha A7 IV -> TS-A74-001, A7
    if (code.includes('a74') || code.includes('a7iv') || code.includes('a7') || serial.includes('a7')) {
      const match = chiTietList.find(ct => {
        const name = (ct.ten_mau || '').toLowerCase();
        return name.includes('a7 iv') || name.includes('a7iv') || name.includes('a7') || name.includes('sony');
      });
      if (match) return match;
    }

    // Canon EOS R5 -> TS-EOSR5-001, R5
    if (code.includes('eosr5') || code.includes('r5') || serial.includes('r5') || code.includes('canon') || serial.includes('canon')) {
      const match = chiTietList.find(ct => {
        const name = (ct.ten_mau || '').toLowerCase();
        return name.includes('r5') || name.includes('canon');
      });
      if (match) return match;
    }

    // Fuji X-T5 -> TS-XT5-001, XT5, FUJI
    if (code.includes('xt5') || serial.includes('xt5') || code.includes('fuji') || serial.includes('fuji')) {
      const match = chiTietList.find(ct => {
        const name = (ct.ten_mau || '').toLowerCase();
        return name.includes('xt5') || name.includes('fuji');
      });
      if (match) return match;
    }

    // Generic fallback: word overlap
    const codeWords = code.split(/[^a-z0-9]/).filter(w => w.length > 1);
    for (const ct of chiTietList) {
      const name = (ct.ten_mau || '').toLowerCase();
      for (const word of codeWords) {
        if (word !== 'ts' && word !== 'sn' && name.includes(word)) {
          return ct;
        }
      }
    }

    return chiTietList[0];
  };

  // Mapper cho chi tiết thanh lý
  const mapLiquidationDetail = (o) => {
    const detail = {
      id: o.id,
      orderCode: o.ma_don || o.orderCode || '',
      customerName: o.khach_hang?.ho_ten || o.customerName || 'Khách hàng',
      customerEmail: o.khach_hang?.email || o.customerEmail || '',
      customerPhone: o.khach_hang?.so_dien_thoai || o.customerPhone || '',
      expectedReturnDate: o.ngay_tra?.split('T')[0] || o.expectedReturnDate || '',
      receiveDate: o.ngay_nhan?.split('T')[0] || o.receiveDate || '',
      depositAmount: Number(o.tong_tien_coc || o.depositAmount) || 0,
      orderStatus: o.trang_thai || o.orderStatus || 'DANG_THUE',
      liquidationStatus: o.phieu_tra?.id ? 'Đã thanh lý' : 'Chờ thanh lý',
      notes: o.ghi_chu || o.notes || '',
      handoverNotes: o.phieu_ban_giao?.ghi_chu || o.handoverNotes || '',
    };

    const combos = [];
    if (o.chi_tiet_don_thue) {
      o.chi_tiet_don_thue.forEach((ct) => {
        const matchingPhysical = (o.thiet_bi_gan_voi_don || []).filter((tb) => {
          if (tb.chi_tiet_don_thue_id) {
            return tb.chi_tiet_don_thue_id === ct.id;
          }
          const matchedCt = findMatchingChiTiet(tb, o.chi_tiet_don_thue);
          return matchedCt && matchedCt.id === ct.id;
        });
        
        for (let i = 0; i < ct.so_luong; i++) {
          const physical = matchingPhysical[i];
          const items = [];
          if (physical) {
            items.push({
              id: physical.id,
              thiet_bi_id: physical.thiet_bi_id,
              name: ct.ten_mau || 'Thiết bị chính',
              managementType: 'IDENTIFIED_ASSET',
              serial: physical.so_serial,
              assetCode: physical.ma_tai_san,
              stateBefore: physical.tinh_trang_truoc || 'Tốt',
              stateAfter: physical.tinh_trang_sau || 'Sẵn sàng',
            });
          }
          
          combos.push({
            productName: ct.ten_mau || 'Thiết bị',
            unitIndex: i + 1,
            items: items
          });
        }
      });
    }
    detail.combos = combos;
    return detail;
  };

  const fetchLiquidations = async () => {
    try {
      setLoading(true);
      const res = await orderApi.admin.getLiquidations();
      const rawData = res.data?.data || res.data;
      const list = Array.isArray(rawData) ? rawData : (rawData?.danh_sach || []);
      setOrders(list.map(mapLiquidation));
    } catch (err) {
      console.error('Lỗi tải danh sách thanh lý:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLiquidations(); }, []);
  const [toast, setToast] = useState(null);

  // Filters state
  const [filterOrderCode, setFilterOrderCode] = useState('');
  const [filterCustomerName, setFilterCustomerName] = useState('');
  const [filterExpectedReturnDate, setFilterExpectedReturnDate] = useState('');
  const [filterOrderStatus, setFilterOrderStatus] = useState('');
  const [filterLiquidationStatus, setFilterLiquidationStatus] = useState('');

  // Modals state
  const [selectedDetailOrder, setSelectedDetailOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Return slip and audit form state
  const [selectedFormOrder, setSelectedFormOrder] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  // Form input states
  const [formCombos, setFormCombos] = useState([]);
  const [formPhotos, setFormPhotos] = useState([]);
  const [settlementType, setSettlementType] = useState('DEDUCT'); // 'REFUND_FULL' or 'DEDUCT'
  const [refundAmount, setRefundAmount] = useState(0);
  const [deductionAmount, setDeductionAmount] = useState(0);
  const [deductionReason, setDeductionReason] = useState('');
  const [liquidationNotes, setLiquidationNotes] = useState('');
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Pre-fill form when opening ORD001 - Lấy chi tiết thật từ BE trước
  const handleOpenForm = async (order) => {
    if (order.liquidationStatus === 'Đã thanh lý') {
      return; // Handled by disabled button or direct warning
    }
    
    try {
      setLoading(true);
      const res = await orderApi.admin.getLiquidationDetail(order.id);
      const detailData = res.data?.data || res.data;
      const mappedDetail = mapLiquidationDetail(detailData);

      setSelectedFormOrder(mappedDetail);
      // Clone combos safely
      const clonedCombos = JSON.parse(JSON.stringify(mappedDetail.combos || []));
      setFormCombos(clonedCombos);
      
      // Reset form photos and uploaded URLs
      setFormPhotos([]);
      setUploadedReturnImageUrls([]);

      // Reset form fields
      setSettlementType('REFUND_FULL');
      setDeductionAmount(0);
      setDeductionReason('');
      setRefundAmount(mappedDetail.depositAmount || 0);
      setLiquidationNotes('');
      setMaintenanceRecords([]);

      setShowFormModal(true);
    } catch (err) {
      alert('Không thể lấy chi tiết đơn thuê để lập phiếu trả: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = async (order) => {
    try {
      const res = await orderApi.admin.getLiquidationDetail(order.id);
      const detailData = res.data?.data || res.data;
      setSelectedDetailOrder(mapLiquidationDetail(detailData));
    } catch {
      setSelectedDetailOrder(order); // Fallback to list data
    }
    setShowDetailModal(true);
  };

  // Upload return images via API 16
  const handleUploadReturnImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    try {
      setUploadingReturnImages(true);
      const res = await orderApi.admin.uploadReturnImages(selectedFormOrder.id, files);
      const images = res.data?.data?.danh_sach_anh || res.data?.data?.images || res.data?.images || [];
      setUploadedReturnImageUrls(prev => [...prev, ...images]);
      // Add to formPhotos for UI display
      const newPhotos = files.map((f, i) => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
        previewUrl: images[i]?.file_url || images[i]?.fileUrl || URL.createObjectURL(f)
      }));
      setFormPhotos(prev => [...prev, ...newPhotos]);
      showToast('Tải ảnh trả máy thành công');
    } catch (err) {
      console.error('Lỗi upload ảnh trả máy:', err);
      showToast('Lỗi khi tải ảnh, vui lòng thử lại');
    } finally {
      setUploadingReturnImages(false);
      // Reset input so same file can be re-selected
      if (returnImagesInputRef.current) returnImagesInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = (idx) => {
    setFormPhotos(formPhotos.filter((_, i) => i !== idx));
    showToast('Đã xóa ảnh chụp');
  };

  // Field change handlers inside Return Form
  const handleSerialConditionChange = (comboIdx, itemIdx, val) => {
    const updated = [...formCombos];
    const item = updated[comboIdx].items[itemIdx];
    item.stateAfter = val;
    
    if (val === 'Tốt' || val === 'Trầy xước nhẹ') {
      item.isDamaged = false;
      item.isMissing = false;
    } else if (val === 'Hư hỏng') {
      item.isDamaged = true;
      item.isMissing = false;
    } else if (val === 'Mất') {
      item.isDamaged = false;
      item.isMissing = true;
    }
    
    setFormCombos(updated);

    // Dynamic adjustment: If any item is damaged or missing, automatically suggest DEDUCT cọc
    recalculateSettlementStates(updated);
  };

  const handleQuantityReturnedChange = (comboIdx, itemIdx, val) => {
    const num = Math.max(0, parseInt(val) || 0);
    const updated = [...formCombos];
    const item = updated[comboIdx].items[itemIdx];
    
    // Limit to delivered quantity
    const returned = Math.min(item.deliveredQuantity, num);
    item.returnedQuantity = returned;
    item.missingQuantity = item.deliveredQuantity - returned;
    
    // Ensure damaged cannot be higher than returned
    if (item.damagedQuantity > returned) {
      item.damagedQuantity = returned;
    }

    setFormCombos(updated);
    recalculateSettlementStates(updated);
  };

  const handleQuantityDamagedChange = (comboIdx, itemIdx, val) => {
    const num = Math.max(0, parseInt(val) || 0);
    const updated = [...formCombos];
    const item = updated[comboIdx].items[itemIdx];
    
    // Limit to returned quantity
    item.damagedQuantity = Math.min(item.returnedQuantity, num);
    
    setFormCombos(updated);
    recalculateSettlementStates(updated);
  };

  const recalculateSettlementStates = (combosList) => {
    let hasDamage = false;
    let hasMissing = false;
    let damagedAsset = null;

    combosList.forEach(cb => {
      cb.items.forEach(it => {
        if (it.managementType === 'IDENTIFIED_ASSET') {
          if (it.stateAfter === 'Hư hỏng') {
            hasDamage = true;
            damagedAsset = it;
          }
          if (it.stateAfter === 'Mất') hasMissing = true;
        } else {
          if (it.damagedQuantity > 0) hasDamage = true;
          if (it.missingQuantity > 0) hasMissing = true;
        }
      });
    });

    if (hasDamage || hasMissing) {
      setSettlementType('DEDUCT');
      if (hasDamage && !hasMissing) {
        setDeductionReason(`Khấu trừ hao tổn hư hại thiết bị: ${damagedAsset ? damagedAsset.name : 'Thiết bị phụ kiện'}`);
        setDeductionAmount(1000000);
      } else if (hasMissing) {
        setDeductionReason(`Khấu trừ đền bù tài sản bị tổn thất/mất`);
        setDeductionAmount(1500000);
      } else {
        setDeductionReason('Thiết bị hỏng hóc và hao hụt phụ tùng đi kèm');
        setDeductionAmount(2000000);
      }
    }

    // Dynamic regeneration of suggestion cards for maintenance (lưu cả ID thiết bị)
    const repairs = [];
    combosList.forEach(cb => {
      cb.items.forEach(it => {
        if (it.managementType === 'IDENTIFIED_ASSET' && it.stateAfter === 'Hư hỏng') {
          repairs.push({
            thiet_bi_id: it.thiet_bi_id,
            thiet_bi_gan_voi_don_id: it.id,
            assetCode: it.assetCode,
            equipmentName: it.name,
            serial: it.serial,
            reason: `Linh kiện ${it.name} bị hư hỏng móp méo lúc khách hoàn trả`,
            note: `Hợp đồng ORD001 thanh lý phát sinh hư hỏng`,
            saved: true
          });
        }
      });
    });
    setMaintenanceRecords(repairs);
  };

  // Helpers to count components for each combo accordion badge
  const getAccordionBadgeState = (combo) => {
    let checkedCount = 0;
    const totalCount = combo.items.length;
    let hasIssue = false;

    combo.items.forEach(it => {
      if (it.managementType === 'IDENTIFIED_ASSET') {
        if (it.stateAfter) {
          checkedCount += 1;
        }
        if (it.stateAfter === 'Hư hỏng' || it.stateAfter === 'Mất') {
          hasIssue = true;
        }
      } else {
        // Quantity items are always counted if values are filled
        if (it.returnedQuantity !== undefined) {
          checkedCount += 1;
        }
        if (it.damagedQuantity > 0 || it.missingQuantity > 0) {
          hasIssue = true;
        }
      }
    });

    if (checkedCount < totalCount) {
      return {
        label: 'Chưa kiểm kê đủ',
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        countLabel: `${checkedCount}/${totalCount} thành phần`
      };
    }

    if (hasIssue) {
      return {
        label: 'Có phát sinh',
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        countLabel: `${checkedCount}/${totalCount} thành phần`
      };
    }

    return {
      label: 'Đã kiểm kê đủ',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      countLabel: `${checkedCount}/${totalCount} thành phần`
    };
  };

  // Main Submit handler for Liquidation
  const handleConfirmSubmitLiquidation = async (e) => {
    e.preventDefault();

    // 1. Validation checks
    if (!selectedFormOrder) return;

    // Check all serial components have filled conditions
    let allChecked = true;
    formCombos.forEach(cb => {
      cb.items.forEach(it => {
        if (it.managementType === 'IDENTIFIED_ASSET') {
          if (!it.stateAfter) {
            allChecked = false;
          }
        }
      });
    });

    if (!allChecked) {
      alert('Vui lòng kiểm kê đầy đủ tài sản và phụ kiện');
      return;
    }

    // Photo check
    if (formPhotos.length === 0) {
      alert('Ảnh khi trả không hợp lệ');
      return;
    }

    // Money and Deduct policy validity
    let hasIssueInAudit = false;
    formCombos.forEach(cb => {
      cb.items.forEach(it => {
        if (it.managementType === 'IDENTIFIED_ASSET') {
          if (it.stateAfter === 'Hư hỏng' || it.stateAfter === 'Mất') {
            hasIssueInAudit = true;
          }
        } else {
          if (it.damagedQuantity > 0 || it.missingQuantity > 0) {
            hasIssueInAudit = true;
          }
        }
      });
    });

    if (settlementType === 'REFUND_FULL' && hasIssueInAudit) {
      alert('Đơn hàng không đủ điều kiện hoàn cọc');
      return;
    }

    if (!settlementType) {
      alert('Vui lòng chọn hoàn cọc hoặc khấu trừ cọc');
      return;
    }

    // Validate deduction amount limit
    if (settlementType === 'DEDUCT') {
      if (deductionAmount <= 0 || deductionAmount > selectedFormOrder.depositAmount) {
        alert('Số tiền khấu trừ không hợp lệ');
        return;
      }
      if (!deductionReason.trim()) {
        alert('Vui lòng nhập lý do khấu trừ');
        return;
      }
    }

    // Build assets payload for API 17 (dùng tiếng Việt theo DB)
    const assetsPayload = [];
    formCombos.forEach(cb => {
      cb.items.forEach(it => {
        assetsPayload.push({
          thiet_bi_gan_voi_don_id: it.id,
          bi_hu_hong: it.stateAfter === 'Hư hỏng',
          bi_mat: it.stateAfter === 'Mất',
          tinh_trang: it.stateAfter || 'Sẵn sàng',
          ghi_chu: it.notes || ''
        });
      });
    });

    try {
      setSubmitting(true);
      const orderId = selectedFormOrder.id;

      // Step 1: API 17 – Create return inspection
      await orderApi.admin.createReturnInspection(orderId, {
        danh_sach_tai_san: assetsPayload,
        danh_sach_anh_url: uploadedReturnImageUrls,
        ghi_chu: liquidationNotes || 'Thanh lý hoàn tất phiếu kiểm kê.',
        ket_qua: hasIssueInAudit ? 'CO_SU_CO' : 'HOP_LE'
      });

      // Step 2: API 18 or 19 – Process deposit
      if (settlementType === 'REFUND_FULL') {
        await orderApi.admin.processRefundDeposit(orderId, {
          so_tien: selectedFormOrder.depositAmount,
          ma_giao_dich: 'REFUND_' + Date.now(),
          ghi_chu: 'Hoàn cọc 100% - thiết bị trả nguyên vẹn'
        });
      } else {
        await orderApi.admin.processDeductDeposit(orderId, {
          danh_sach_phi: [{
            so_tien: deductionAmount,
            ly_do: deductionReason
          }],
          ma_giao_dich: 'DEDUCT_' + Date.now(),
          ghi_chu: liquidationNotes || 'Khấu trừ cọc do hư hỏng/mất thiết bị'
        });
      }

      // Step 3: API 20 – Create maintenance records for damaged items
      for (const m of maintenanceRecords) {
        if (m.saved) {
          await orderApi.admin.createMaintenanceRecord(orderId, {
            thiet_bi_id: m.thiet_bi_id,
            thiet_bi_gan_voi_don_id: m.thiet_bi_gan_voi_don_id,
            ly_do: m.reason,
            ghi_chu: m.note
          });
        }
      }

      setShowFormModal(false);
      showToast('Thanh lý hợp đồng thành công!');

      // Refresh the list from server
      await fetchLiquidations();
    } catch (err) {
      console.error('Lỗi thanh lý hợp đồng:', err);
      const errMsg = err.response?.data?.message || 'Có lỗi xảy ra khi thanh lý hợp đồng';
      alert(`Lỗi: ${errMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  // Filters application
  const filteredOrders = orders.filter(o => {
    const matchesCode = filterOrderCode === '' || o.orderCode.toLowerCase().includes(filterOrderCode.toLowerCase());
    const matchesCust = filterCustomerName === '' || o.customerName.toLowerCase().includes(filterCustomerName.toLowerCase());
    const matchesDate = filterExpectedReturnDate === '' || o.expectedReturnDate.includes(filterExpectedReturnDate);
    const matchesStatus = filterOrderStatus === '' || o.orderStatus === filterOrderStatus;
    const matchesLiq = filterLiquidationStatus === '' || o.liquidationStatus === filterLiquidationStatus;
    
    return matchesCode && matchesCust && matchesDate && matchesStatus && matchesLiq;
  });

  return (
    <div className="space-y-6 text-left selection:bg-indigo-200">
      
      {/* Toast Alert pop */}
      {toast && (
        <div className="fixed top-5 right-5 z-[2000] bg-slate-900 border border-slate-800 text-white p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-fadeIn">
          <div className="bg-emerald-500 p-1.5 rounded-full text-white">
            <Check className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold font-sans">{toast.message}</p>
          </div>
        </div>
      )}

      {/* Header section with Breadcrumb */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5 font-mono">
            <span>Trang chủ</span>
            <span>/</span>
            <span className="text-indigo-650 font-black">Thanh lý hợp đồng</span>
          </div>
          <h2 className="text-lg font-black text-[#00236f] uppercase tracking-wide flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-indigo-600" />
            Thanh lý hợp đồng
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Xử lý thu hồi thiết bị, lập biên bản kiểm kê hao tổn thực tế của từng combo máy ảnh và hoàn trả đặt cọc quỹ.</p>
        </div>
      </div>

      {/* Search Filters Card */}
      <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm">
        <h3 className="text-xs uppercase font-extrabold text-slate-500 mb-3.5 flex items-center gap-1.5 tracking-wider">
          <Search className="w-3.5 h-3.5 text-indigo-500" />
          Bộ lọc tìm kiếm thông tin
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* Mã đơn hàng */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] text-slate-400 font-bold uppercase">Mã đơn hàng</label>
            <input 
              type="text" 
              placeholder="Ví dụ: ORD001"
              value={filterOrderCode}
              onChange={(e) => setFilterOrderCode(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Tên khách hàng */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] text-slate-400 font-bold uppercase">Tên khách hàng</label>
            <input 
              type="text" 
              placeholder="Nhập tên khách..."
              value={filterCustomerName}
              onChange={(e) => setFilterCustomerName(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Ngày trả dự kiến */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] text-slate-400 font-bold uppercase">Ngày trả dự kiến</label>
            <input 
              type="text" 
              placeholder="dd/mm/yyyy"
              value={filterExpectedReturnDate}
              onChange={(e) => setFilterExpectedReturnDate(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none font-bold text-slate-800 focus:bg-white focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Trạng thái đơn hàng */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] text-slate-400 font-bold uppercase">Trạng thái đơn hàng</label>
            <select
              value={filterOrderStatus}
              onChange={(e) => setFilterOrderStatus(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-extrabold text-slate-700 cursor-pointer focus:bg-white focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Tất cả</option>
              <option value="Đang thuê">Đang thuê</option>
              <option value="Hoàn tất">Hoàn tất</option>
            </select>
          </div>

          {/* Trạng thái thanh lý */}
          <div className="space-y-1 text-left">
            <label className="text-[10px] text-slate-400 font-bold uppercase">Trạng thái thanh lý</label>
            <select
              value={filterLiquidationStatus}
              onChange={(e) => setFilterLiquidationStatus(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none font-extrabold text-slate-700 cursor-pointer focus:bg-white focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Tất cả</option>
              <option value="Chờ kiểm kê">Chờ kiểm kê</option>
              <option value="Đã thanh lý">Đã thanh lý</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Table List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[900px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[#00236f] text-[10px] font-black uppercase tracking-wider">
                <th className="px-6 py-4 whitespace-nowrap min-w-[130px]">Mã đơn hàng</th>
                <th className="px-6 py-4 whitespace-nowrap min-w-[180px]">Tên khách hàng</th>
                <th className="px-6 py-4 whitespace-nowrap min-w-[120px]">Ngày nhận</th>
                <th className="px-6 py-4 whitespace-nowrap min-w-[140px]">Ngày trả dự kiến</th>
                <th className="px-6 py-4 whitespace-nowrap text-right min-w-[140px]">Tổng tiền cọc</th>
                <th className="px-6 py-4 whitespace-nowrap text-center min-w-[140px]">Trạng thái đơn</th>
                <th className="px-6 py-4 whitespace-nowrap text-center min-w-[140px]">Trạng thái thanh lý</th>
                <th className="px-6 py-4 whitespace-nowrap text-right min-w-[240px]">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-650">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-400 italic font-bold">
                    Không tìm thấy hợp đồng nào đang chờ thanh lý phù hợp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(o => {
                  const isCompleted = o.liquidationStatus === 'Đã thanh lý';
                  return (
                    <tr key={o.orderCode} className="hover:bg-slate-50/50 transition duration-150">
                      
                      {/* Mã đơn */}
                      <td className="px-6 py-4 text-[#00236f] font-mono font-bold leading-none">{o.orderCode}</td>
                      
                      {/* Tên khách */}
                      <td className="px-6 py-4 font-bold text-slate-900">{o.customerName}</td>
                      
                      {/* Ngày nhận */}
                      <td className="px-6 py-4 font-mono font-semibold">{o.receiveDate}</td>
                      
                      {/* Ngày trả dự */}
                      <td className="px-6 py-4 font-mono font-semibold">{o.expectedReturnDate}</td>
                      
                      {/* Tổng tiền cọc */}
                      <td className="px-6 py-4 text-right font-mono font-bold text-slate-800">{formatVND(o.depositAmount)}</td>
                      
                      {/* Trạng thái đơn */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                          o.orderStatus === 'Đang thuê' 
                            ? 'bg-blue-50 text-blue-700 border-blue-200' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-250'
                        }`}>
                          {o.orderStatus}
                        </span>
                      </td>

                      {/* Trạng thái thanh lý */}
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                          o.liquidationStatus === 'Chờ kiểm kê' 
                            ? 'bg-amber-50 text-amber-700 border-amber-200' 
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        }`}>
                          {o.liquidationStatus}
                        </span>
                      </td>

                      {/* KHU VỰC THAO TÁC CÓ 2 NÚT NGANG HÀNG BẮT BUỘC KHÔNG ĐƯỢC CHẤP VÁ */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end items-center">
                          <button
                            type="button"
                            onClick={() => handleOpenDetail(o)}
                            className="px-3 py-2 text-xs font-bold text-[#00236f] bg-[#00236f]/5 hover:bg-[#00236f]/10 rounded-xl transition cursor-pointer"
                          >
                            Xem chi tiết
                          </button>

                          <div className="relative group">
                            <button
                              type="button"
                              disabled={isCompleted}
                              onClick={() => handleOpenForm(o)}
                              className={`px-3 py-2 text-xs font-bold rounded-xl transition ${
                                isCompleted
                                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs cursor-pointer'
                              }`}
                            >
                              Lập phiếu trả và kiểm kê
                            </button>
                            
                            {isCompleted && (
                              <div className="absolute right-0 bottom-full mb-1.5 hidden group-hover:block transition duration-200 z-[100] max-w-[200px] w-48 text-left bg-slate-900 text-white rounded-lg p-2.5 shadow-2xl">
                                <p className="text-[10px] font-bold font-sans">Đơn hàng đã được thanh lý</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. MODAL BOX "XEM CHI TIẾT THANH LÝ" (Chỉ xem, tuyệt đối cấm nút nghiệp vụ chính) */}
      {/* ========================================================= */}
      {showDetailModal && selectedDetailOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[1100] flex justify-end animate-fadeIn font-sans">
          <div className="bg-white w-full max-w-2xl h-screen shadow-2xl flex flex-col animate-slideLeft text-slate-800 text-xs">
            
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50.">
              <div>
                <h3 className="text-sm font-black text-[#00236f] uppercase">Chi tiết hồ sơ thanh lý</h3>
                <p className="text-[11px] text-slate-400 font-bold font-mono">Đơn thuê: {selectedDetailOrder.orderCode}</p>
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Scroll */}
            <div className="flex-grow overflow-y-auto p-6 space-y-5.5 text-left font-semibold">
              
              {/* Grid 1: Khách hàng và đơn hàng */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Thông tin khách hàng */}
                <div className="bg-slate-50 p-4 border border-slate-200/60 rounded-xl space-y-1.5">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block tracking-wider">Thông tin khách hàng</span>
                  <div>
                    <span className="text-slate-400">Họ tên:</span>
                    <p className="text-slate-900 font-black">{selectedDetailOrder.customerName}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Email:</span>
                    <p className="text-slate-850 font-mono font-bold">{selectedDetailOrder.customerEmail}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Số điện thoại:</span>
                    <p className="text-slate-850 font-mono font-bold">{selectedDetailOrder.customerPhone}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold">Trạng thái xác minh:</span>
                    <span className="ml-1.5 text-[10px] text-emerald-700 bg-emerald-55 px-2 py-0.5 rounded font-black border border-emerald-100">
                      {selectedDetailOrder.verificationStatus}
                    </span>
                  </div>
                </div>

                {/* Thông tin đơn hàng */}
                <div className="bg-slate-50 p-4 border border-slate-200/60 rounded-xl space-y-1.5">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block tracking-wider">Hợp đồng thuê máy</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400">Ngày nhận:</span>
                      <p className="text-slate-850 font-mono font-bold">{selectedDetailOrder.receiveDate}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Trả dự kiến:</span>
                      <p className="text-slate-850 font-mono font-bold">{selectedDetailOrder.expectedReturnDate}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Tổng tiền thuê:</span>
                      <p className="text-[#00236f] font-mono font-black text-sm">{formatVND(selectedDetailOrder.rentAmount)}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Tổng tiền cọc:</span>
                      <p className="text-emerald-700 font-mono font-black text-sm">{formatVND(selectedDetailOrder.depositAmount)}</p>
                    </div>
                  </div>
                  <div className="pt-1 flex gap-2 flex-wrap">
                    <span className="text-[9px] font-black uppercase bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                      Đơn: {selectedDetailOrder.orderStatus}
                    </span>
                    <span className="text-[9px] font-black uppercase bg-slate-150 text-slate-650 px-2 py-0.5 rounded border border-slate-200">
                      Thanh lý: {selectedDetailOrder.liquidationStatus}
                    </span>
                  </div>
                </div>

              </div>

              {/* Thông tin bàn giao */}
              <div className="border border-slate-250 p-4 rounded-xl space-y-2 background-white">
                <span className="text-[9.5px] text-slate-400 font-extrabold uppercase block tracking-wider border-b pb-1.5">Nhật ký bàn giao sơ bộ ban đầu</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-slate-400">Ngày bàn giao:</span>
                    <p className="text-slate-800 font-mono font-bold">{selectedDetailOrder.handoverDate || '-'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Nhân viên bàn giao:</span>
                    <p className="text-slate-800 font-bold">{selectedDetailOrder.handoverStaff || '-'}</p>
                  </div>
                  <div>
                    <span className="text-slate-400">Hợp đồng giấy:</span>
                    <p className="text-indigo-700 font-bold font-mono">📄 {selectedDetailOrder.paperContract || 'Không có scan'}</p>
                  </div>
                </div>
                {selectedDetailOrder.handoverPhoto && (
                  <div className="pt-1.5">
                    <span className="text-slate-400 block mb-1">Ảnh chụp lúc bàn giao thiết bị:</span>
                    <span className="inline-flex px-2 py-1 bg-indigo-50 border border-indigo-150 rounded text-indigo-700 font-mono font-bold text-[10px]">
                      🌌 {selectedDetailOrder.handoverPhoto}
                    </span>
                  </div>
                )}
                {selectedDetailOrder.handoverNotes && (
                  <div className="mt-1">
                    <span className="text-slate-400">Ghi chú bàn giao:</span>
                    <p className="text-slate-700 italic font-medium">"{selectedDetailOrder.handoverNotes}"</p>
                  </div>
                )}
              </div>

              {/* Đã kiểm kê chưa? */}
              <div className="space-y-3">
                <span className="text-[10px] text-indigo-900 font-extrabold uppercase block tracking-wider">Danh sách tài sản &amp; phụ kiện gán theo combo bàn giao</span>
                
                {selectedDetailOrder.combos && selectedDetailOrder.combos.map((cb, cIdx) => (
                  <div key={cIdx} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/20">
                    <div className="bg-slate-100/50 px-4 py-2 flex justify-between items-center border-b border-slate-200">
                      <strong className="text-slate-900 font-black">{cb.productName} #{cb.unitIndex}</strong>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 font-bold font-mono rounded">
                        {cb.items ? cb.items.length : 0} thành phần
                      </span>
                    </div>

                    <div className="p-2 overflow-x-auto">
                      <table className="w-full text-[11px] border-collapse">
                        <thead>
                          <tr className="text-slate-400 font-black text-left uppercase border-b border-slate-100">
                            <th className="p-1.5">Thành phần</th>
                            <th className="p-1.5 text-center">Gán sê-ri / SL</th>
                            <th className="p-1.5">Hiện trạng giao</th>
                            <th className="p-1.5">Trạng thái hiện tại</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                          {cb.items && cb.items.map((it, iIdx) => (
                            <tr key={iIdx}>
                              <td className="p-1.5 font-bold text-slate-950">{it.name}</td>
                              <td className="p-1.5 text-center font-mono font-bold text-indigo-850">
                                {it.managementType === 'IDENTIFIED_ASSET' ? (it.serial || it.assetCode) : `${it.deliveredQuantity} món`}
                              </td>
                              <td className="p-1.5">
                                <span className="bg-slate-100 px-2 py-0.5 text-slate-600 rounded font-bold">{it.stateBefore}</span>
                              </td>
                              <td className="p-1.5">
                                <span className={`px-2 py-0.5 rounded font-black ${
                                  it.stateAfter === 'Hư hỏng' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                  it.stateAfter === 'Mất' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                  'bg-emerald-50 text-emerald-700 border-emerald-250'
                                }`}>
                                  {it.stateAfter || 'Sẵn sàng'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>

              {/* Kết quả kiểm kê sau thanh lý */}
              {selectedDetailOrder.liquidationResults && (
                <div className="bg-emerald-50/30 border border-emerald-200 p-4.5 rounded-xl space-y-3">
                  <span className="text-[10px] text-emerald-800 font-black uppercase block tracking-wider border-b border-emerald-200/50 pb-1.5 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    Biên bản bàn trả và kết quả thanh lý cọc
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-slate-400 block font-bold">Ghi chú kiểm kê:</span>
                      <p className="text-slate-900 font-bold italic">"{selectedDetailOrder.liquidationResults.returnNotes}"</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">Xử lý cọc:</span>
                      <p className="text-slate-950 font-black uppercase text-[11px] text-indigo-700 mt-0.5">
                        {selectedDetailOrder.liquidationResults.settlementType === 'REFUND_FULL' ? 'Hoàn cọc 100%' : 'Khấu trừ phạt cọc'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">Đã hoàn khách cọc:</span>
                      <p className="text-emerald-750 font-mono font-black text-sm">{formatVND(selectedDetailOrder.liquidationResults.depositReturned)}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold">Đáo khấu đền bù:</span>
                      <p className="text-rose-600 font-mono font-black text-sm">{formatVND(selectedDetailOrder.liquidationResults.depositDeducted)}</p>
                    </div>
                  </div>

                  {selectedDetailOrder.liquidationResults.deductedReason && (
                    <div className="bg-white p-2.5 rounded-lg border border-red-100 text-slate-800">
                      <span className="text-red-500 font-bold block uppercase text-[8.5px]">Lý do khấu trừ bồi thường:</span>
                      <p className="font-extrabold text-xs">{selectedDetailOrder.liquidationResults.deductedReason}</p>
                    </div>
                  )}

                  {selectedDetailOrder.liquidationResults.photos && selectedDetailOrder.liquidationResults.photos.length > 0 && (
                    <div className="pt-1.5">
                      <span className="text-slate-400 font-bold block mb-1">Ảnh thực chứng hồi lưu:</span>
                      <div className="flex gap-2">
                        {selectedDetailOrder.liquidationResults.photos.map(p => (
                          <span key={p} className="bg-slate-100 font-bold font-mono text-[9.5px] text-slate-705 px-2.5 py-1 rounded">
                            📸 {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Modal Footer (Tuyệt đối không có các nút nghiệp vụ gấu lợn) */}
            <div className="p-4.5 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button 
                type="button" 
                onClick={() => setShowDetailModal(false)}
                className="px-5 py-2.5 bg-slate-250 text-slate-700 font-black rounded-xl hover:bg-slate-350 transition uppercase text-xs cursor-pointer"
              >
                Đóng chi tiết
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. MODAL DRAWER "LẬP PHIẾU TRẢ VÀ KIỂM KÊ" */}
      {/* ========================================================= */}
      {showFormModal && selectedFormOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[1100] flex justify-end animate-fadeIn font-sans">
          <div className="bg-white w-full max-w-5xl h-screen shadow-2xl flex flex-col animate-slideLeft">
            
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-indigo-750 font-black uppercase flex items-center gap-1">
                  <span className="w-2 h-2 bg-indigo-650 rounded-full animate-ping"></span>
                  Lập biên bản kiểm kê &amp; Trả máy
                </span>
                <h3 className="text-base font-black text-[#00236f] uppercase mt-0.5">Biên bản trả máy và tất toán cọc đơn {selectedFormOrder.orderCode}</h3>
              </div>
              <button 
                onClick={() => setShowFormModal(false)}
                className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-900 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Main Layout with standard sidebar inside */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 text-slate-900 text-xs">
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Area (A, B, C) */}
                <div className="lg:col-span-8 space-y-5.5 text-left font-semibold">
                  
                  {/* A. THÔNG TIN KHÁCH HÀNG */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                    <h4 className="text-[10.5px] text-[#00236f] font-black uppercase tracking-wider flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      A. Thông tin khách hàng
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-semibold pt-1">
                      <div>
                        <span className="text-slate-400 font-bold block uppercase text-[9px]">Họ tên khách hàng</span>
                        <p className="text-slate-950 font-black">{selectedFormOrder.customerName}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block uppercase text-[9px]">Email</span>
                        <p className="text-slate-800 font-mono font-bold truncate">{selectedFormOrder.customerEmail}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block uppercase text-[9px]">Số điện thoại</span>
                        <p className="text-slate-800 font-mono font-bold">{selectedFormOrder.customerPhone || '0901234567'}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block uppercase text-[9px]">Xác minh đối chất</span>
                        <p className="text-emerald-700 bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded-full inline-block font-black text-[10px]">
                          {selectedFormOrder.verificationStatus}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* B. THÔNG TIN ĐƠN HÀNG */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                    <h4 className="text-[10.5px] text-[#00236f] font-black uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      B. Thông tin hợp đồng thuê
                    </h4>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold pt-1">
                      <div>
                        <span className="text-slate-400 font-bold block uppercase text-[9px]">Đơn hàng cọc máy</span>
                        <p className="text-slate-950 font-extrabold">{selectedFormOrder.orderCode}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block uppercase text-[9px]">Chu kỳ ngày thuê</span>
                        <p className="text-slate-850 font-bold font-mono">
                          {selectedFormOrder.receiveDate} → {selectedFormOrder.expectedReturnDate} ({selectedFormOrder.durationDays || 3} ngày)
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block uppercase text-[9px]">Tổng tiền thuê trả</span>
                        <p className="text-[#00236f] font-mono font-black">{formatVND(selectedFormOrder.rentAmount || 2400000)}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block uppercase text-[9px]">Cọc quỹ bảo an ký thác</span>
                        <p className="text-emerald-700 font-mono font-black text-sm">{formatVND(selectedFormOrder.depositAmount)}</p>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-3 border-t border-slate-200 mt-2 text-[10.5px] text-slate-500 font-bold">
                      <span>• Đơn: <strong className="text-indigo-600">{selectedFormOrder.orderStatus}</strong></span>
                      <span>• Thanh lý: <strong className="text-amber-600">{selectedFormOrder.liquidationStatus}</strong></span>
                    </div>
                  </div>

                  {/* C. KIỂM KÊ TÀI SẢN VÀ PHỤ KIỆN THEO TỪNG COMBO */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-[11px] text-[#00236f] font-black uppercase tracking-wider flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-indigo-600" />
                        C. Kiểm kê chi tiết tài sản/phụ kiện theo từng Combo bệ gá
                      </h4>
                      <button
                        type="button"
                        onClick={() => {
                          const filled = formCombos.map(combo => {
                            return {
                              ...combo,
                              items: combo.items.map(item => {
                                if (item.managementType === 'IDENTIFIED_ASSET') {
                                  // For fuji we prefill damaged lens, for Sony everything is good as specified in requirement
                                  const isDamagedFujiLens = (combo.productName.includes('Fuji') && item.name.includes('Lens'));
                                  return {
                                    ...item,
                                    stateAfter: isDamagedFujiLens ? 'Hư hỏng' : 'Tốt',
                                    isDamaged: isDamagedFujiLens,
                                    isMissing: false
                                  };
                                } else {
                                  return {
                                    ...item,
                                    returnedQuantity: item.deliveredQuantity,
                                    damagedQuantity: 0,
                                    missingQuantity: 0
                                  };
                                }
                              })
                            };
                          });
                          setFormCombos(filled);
                          recalculateSettlementStates(filled);
                          showToast('Tự động kiểm kê lấp đầy dữ liệu mẫu');
                        }}
                        className="text-[10px] font-black text-indigo-700 hover:text-indigo-900 border border-indigo-250 bg-indigo-50/50 hover:bg-indigo-50 px-2.5 py-1.5 rounded-lg transition"
                      >
                        ⚡ Điền nhanh kiểm kê mẫu
                      </button>
                    </div>

                    {formCombos.map((combo, comboIdx) => {
                      const badgeState = getAccordionBadgeState(combo);
                      return (
                        <div key={comboIdx} className="border border-slate-250 rounded-2xl overflow-hidden bg-white shadow-xs">
                          
                          {/* Accordion Header */}
                          <div className="bg-slate-50 border-b border-slate-200 p-3.5 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="text-slate-400 font-extrabold rotate-0 transition text-[10px]">▼</span>
                              <strong className="text-slate-900 text-[13px] font-black">{combo.productName} #{combo.unitIndex}</strong>
                              <span className="px-2 py-0.5 bg-slate-200/60 rounded text-[10px] font-mono font-bold">{combo.items.length} thiết bị</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[10px] px-2.5 py-0.5 rounded-full border bg-slate-100 font-bold">
                                {badgeState.countLabel}
                              </span>
                              <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full border ${badgeState.bg}`}>
                                {badgeState.label}
                              </span>
                            </div>
                          </div>

                          {/* Detail Table */}
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse mx-0">
                              <thead>
                                <tr className="bg-slate-50/60 text-slate-500 font-black text-[9.5px] uppercase tracking-wider border-b border-slate-100 whitespace-nowrap">
                                  <th className="p-3 whitespace-nowrap">Thành phần</th>
                                  <th className="p-3 whitespace-nowrap">Phân loại</th>
                                  <th className="p-3 text-center whitespace-nowrap">Mã TS / SL Giao</th>
                                  <th className="p-3 font-mono whitespace-nowrap">Mã sê-ri</th>
                                  <th className="p-3 whitespace-nowrap">Tình trạng giao</th>
                                  <th className="p-3 min-w-[140px] whitespace-nowrap">Hiện trạng khi trả</th>
                                  <th className="p-3 text-center min-w-[110px] whitespace-nowrap">Số lượng trả</th>
                                  <th className="p-3 text-center min-w-[80px] whitespace-nowrap">Hư hỏng</th>
                                  <th className="p-3 text-center min-w-[80px] whitespace-nowrap">Mất/Thiếu</th>
                                  <th className="p-3 min-w-[150px] whitespace-nowrap">Ghi chú kiểm tra</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 font-semibold text-xs text-slate-705">
                                {combo.items && combo.items.map((item, itemIdx) => {
                                  
                                  const isSerial = item.managementType === 'IDENTIFIED_ASSET';
                                  
                                  return (
                                    <tr key={itemIdx} className="hover:bg-slate-100/20">
                                      
                                      {/* Tên */}
                                      <td className="p-3 font-extrabold text-slate-900 whitespace-nowrap">{item.name}</td>
                                      
                                      {/* Phân loại quản lý */}
                                      <td className="p-3 whitespace-nowrap">
                                        <span className={`px-2 py-0.5 rounded font-black text-[9.5px] border ${
                                          isSerial ? 'bg-indigo-50 text-indigo-700 border-indigo-150' : 'bg-amber-50 text-amber-700 border-amber-150'
                                        }`}>
                                          {isSerial ? 'Serial' : 'Số lượng'}
                                        </span>
                                      </td>

                                      {/* Mã hoặc SL bàn giao */}
                                      <td className="p-3 text-center font-mono font-bold whitespace-nowrap">
                                        {isSerial ? item.assetCode : item.deliveredQuantity}
                                      </td>

                                      {/* Serial */}
                                      <td className="p-3 font-mono font-bold text-indigo-900 whitespace-nowrap">
                                        {isSerial ? item.serial : '-'}
                                      </td>

                                      {/* Tình trạng giao */}
                                      <td className="p-3 whitespace-nowrap">
                                        <span className="bg-slate-150 px-2 py-0.5 text-slate-700 font-semibold rounded">{item.stateBefore}</span>
                                      </td>

                                      {/* Hiện trạng khi trả */}
                                      <td className="p-3">
                                        {isSerial ? (
                                          <select
                                            value={item.stateAfter || ''}
                                            onChange={(e) => handleSerialConditionChange(comboIdx, itemIdx, e.target.value)}
                                            className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 font-bold outline-none text-slate-800 focus:border-indigo-500"
                                          >
                                            <option value="">-- Chọn tình trạng --</option>
                                            <option value="Tốt">Tốt</option>
                                            <option value="Trầy xước nhẹ">Trầy xước nhẹ</option>
                                            <option value="Hư hỏng">Hư hỏng</option>
                                            <option value="Mất">Mất</option>
                                          </select>
                                        ) : (
                                          <span className="text-slate-400 pl-3.5">-</span>
                                        )}
                                      </td>

                                      {/* Số lượng trả (Phụ kiện) */}
                                      <td className="p-3 text-center">
                                        {!isSerial ? (
                                          <input 
                                            type="number"
                                            min="0"
                                            max={item.deliveredQuantity}
                                            value={item.returnedQuantity ?? 0}
                                            onChange={(e) => handleQuantityReturnedChange(comboIdx, itemIdx, e.target.value)}
                                            className="w-14 text-center bg-white border border-slate-200 rounded-lg py-1 font-bold outline-none text-slate-800"
                                          />
                                        ) : (
                                          <span className="text-slate-455 font-semibold text-slate-400 font-mono">-</span>
                                        )}
                                      </td>

                                      {/* Hư hỏng Check/Input */}
                                      <td className="p-3 text-center">
                                        {isSerial ? (
                                          <input 
                                            type="checkbox"
                                            checked={item.isDamaged || false}
                                            disabled={true} // Readonly because controlled by dropdown Condition
                                            className="w-3.5 h-3.5 text-indigo-600 border-slate-350 rounded pointer-events-none"
                                          />
                                        ) : (
                                          <input 
                                            type="number"
                                            min="0"
                                            max={item.returnedQuantity || 0}
                                            value={item.damagedQuantity ?? 0}
                                            onChange={(e) => handleQuantityDamagedChange(comboIdx, itemIdx, e.target.value)}
                                            className="w-14 text-center bg-white border border-slate-200 rounded-lg py-1 font-bold outline-none text-slate-800"
                                          />
                                        )}
                                      </td>

                                      {/* Mất/Thiếu Check/Display */}
                                      <td className="p-3 text-center font-mono font-bold text-rose-500">
                                        {isSerial ? (
                                          <input 
                                            type="checkbox"
                                            checked={item.isMissing || false}
                                            disabled={true}
                                            className="w-3.5 h-3.5 text-rose-600 border-slate-350 rounded pointer-events-none"
                                          />
                                        ) : (
                                          item.missingQuantity || 0
                                        )}
                                      </td>

                                      {/* Ghi chú */}
                                      <td className="p-3">
                                        <input 
                                          type="text"
                                          placeholder="Nhập ghi chú mòn xước..."
                                          value={item.notes || ''}
                                          onChange={(e) => {
                                            const updated = [...formCombos];
                                            updated[comboIdx].items[itemIdx].notes = e.target.value;
                                            setFormCombos(updated);
                                          }}
                                          className="w-full text-xs bg-slate-50 border border-slate-150 rounded-lg px-2 py-1.5 font-medium outline-none text-slate-800"
                                        />
                                      </td>

                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>

                {/* Right Panel containing Upload, Refund settlements, Maintenance suggestion, notes & confirm buttons (D, E, F, G, H) */}
                <div className="lg:col-span-4 space-y-5 flex flex-col">
                  
                  {/* D. UPLOAD ẢNH KHI TRẢ (Nằm trong form) */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-3.5 text-left font-semibold">
                    <div>
                      <h4 className="text-[10.5px] text-[#00236f] font-black uppercase tracking-wider">D. Ảnh nhận máy khi trả</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Tải lên ảnh chụp tình trạng hiện tại của thiết bị để đối soát bồi hoàn.</p>
                    </div>

                    <input
                      type="file"
                      ref={returnImagesInputRef}
                      onChange={handleUploadReturnImages}
                      accept="image/jpeg,image/png"
                      multiple
                      className="hidden"
                    />
                    <div 
                      onClick={() => returnImagesInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 bg-white hover:bg-slate-100 p-4 text-center rounded-xl cursor-pointer transition flex flex-col items-center justify-center"
                    >
                      <UploadCloud className="w-7 h-7 text-indigo-600 mb-1" />
                      <span className="text-[11px] text-slate-700 font-extrabold block">
                        {uploadingReturnImages ? 'Đang tải lên...' : 'Bấm hoặc Kéo thả ảnh vào đây'}
                      </span>
                      <span className="text-[9px] text-slate-400 font-medium block mt-0.5">Hỗ trợ định dạng JPG, PNG, tối đa 10MB</span>
                    </div>

                    {formPhotos.length > 0 && (
                      <div className="space-y-2 pt-1 border-t border-slate-150">
                        {formPhotos.map((f, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-white border border-slate-200/80 p-2 rounded-lg text-[10.5px]">
                            <img 
                              src={f.previewUrl} 
                              alt="preview" 
                              className="w-8 h-8 rounded object-cover shadow-xs border border-slate-200 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-grow overflow-hidden font-sans">
                              <p className="font-bold text-slate-800 truncate leading-tight">{f.name}</p>
                              <span className="text-[9.5px] text-slate-400 block font-mono font-medium">{f.size}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(idx)}
                              className="p-1 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* E. XỬ LÝ CỌC */}
                  <div className="bg-slate-50 border border-slate-205 rounded-2xl p-4.5 space-y-4 text-left font-semibold">
                    <div>
                      <h4 className="text-[10.5px] text-[#00236f] font-black uppercase tracking-wider">E. Ghi nhận phương án xử lý cọc</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Lựa chọn khấu trừ hoặc hoàn lại đặt cọc dựa trên kiểm kê.</p>
                    </div>

                    {/* Radio Options */}
                    <div className="grid grid-cols-2 gap-2 max-w-full">
                      <label className={`flex flex-col items-center justify-center p-3.5 border-2 rounded-xl cursor-pointer transition select-none ${
                        settlementType === 'REFUND_FULL'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-500'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}>
                        <input 
                          type="radio" 
                          name="settlementType" 
                          value="REFUND_FULL"
                          checked={settlementType === 'REFUND_FULL'}
                          onChange={() => {
                            setSettlementType('REFUND_FULL');
                            setDeductionAmount(0);
                            setRefundAmount(selectedFormOrder.depositAmount);
                          }}
                          className="sr-only"
                        />
                        <span className="text-base font-black">🟢</span>
                        <span className="text-xs font-black uppercase mt-1">Hoàn cọc</span>
                      </label>

                      <label className={`flex flex-col items-center justify-center p-3.5 border-2 rounded-xl cursor-pointer transition select-none ${
                        settlementType === 'DEDUCT'
                          ? 'bg-rose-50 text-rose-800 border-rose-500'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}>
                        <input 
                          type="radio" 
                          name="settlementType" 
                          value="DEDUCT"
                          checked={settlementType === 'DEDUCT'}
                          onChange={() => {
                            setSettlementType('DEDUCT');
                            setDeductionAmount(1000000);
                            setRefundAmount(selectedFormOrder.depositAmount - 1000000);
                          }}
                          className="sr-only"
                        />
                        <span className="text-base font-black">🔴</span>
                        <span className="text-xs font-black uppercase mt-1">Khấu trừ cọc</span>
                      </label>
                    </div>

                    {/* If complete good is selected but fuji lens is broken, show validation alert warning */}
                    {settlementType === 'REFUND_FULL' && selectedFormOrder.orderCode === 'ORD001' && (
                      <div className="bg-amber-100/80 border border-amber-300 text-amber-900 rounded-xl p-3 flex gap-2 text-[10.5px]">
                        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold">Lưu ý kiểm soát:</strong>
                          <span className="font-semibold block mt-0.5">Đơn hàng ORD001 chứa thiết bị Lens XF 35mm được kiểm kê là "Hư hỏng". T-Rent khuyến cáo chọn "Ghi nhận khấu trừ cọc". Nếu hoàn 100% cọc, bạn sẽ không thể bồi thường thiệt hại được.</span>
                        </div>
                      </div>
                    )}

                    {/* Form for settlement details */}
                    <div className="space-y-3.5 pt-1 border-t border-slate-200">
                      
                      <div className="space-y-1">
                        <span className="text-slate-400 block font-bold text-[9px] uppercase font-mono">Đặt cọc giữ tủ ban đầu</span>
                        <p className="text-slate-800 font-mono font-bold text-sm bg-slate-100 rounded-lg px-2.5 py-1.5">{formatVND(selectedFormOrder.depositAmount)}</p>
                      </div>

                      {settlementType === 'REFUND_FULL' ? (
                        <>
                          <div className="space-y-1">
                            <span className="text-slate-400 block font-bold text-[9px] uppercase font-mono">Số tiền hoàn cọc thực tế (VND)</span>
                            <p className="text-emerald-700 font-mono font-black text-sm bg-emerald-50 rounded-lg px-2.5 py-1.5">{formatVND(selectedFormOrder.depositAmount)}</p>
                          </div>
                          <div className="space-y-1">
                            <span className="text-slate-400 block font-bold text-[9.5px]">Phương thức hoàn cọc</span>
                            <select className="w-full text-xs font-bold p-2 bg-white border border-slate-200 rounded-lg outline-none cursor-pointer">
                              <option>VNPAY Sandbox (Mặc định)</option>
                            </select>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-1 text-left">
                            <label className="text-slate-400 block font-bold text-[9px] uppercase font-mono">Số tiền khấu trừ bồi hoàn (VND) <span className="text-rose-500">*</span></label>
                            <input 
                              type="number"
                              required
                              value={deductionAmount}
                              onChange={(e) => {
                                const val = Math.max(0, parseInt(e.target.value) || 0);
                                setDeductionAmount(val);
                                setRefundAmount(selectedFormOrder.depositAmount - val);
                              }}
                              className="w-full font-mono text-sm font-black p-2 bg-white border border-slate-250 rounded-lg outline-none text-slate-800 focus:border-rose-500"
                            />
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">Tiền dư trả lại khách: <strong className="text-slate-700 font-bold">{formatVND(refundAmount)}</strong></p>
                          </div>

                          <div className="space-y-1 text-left">
                            <label className="text-slate-400 block font-bold text-[9.5px] uppercase">Lý do khấu trừ <span className="text-rose-500">*</span></label>
                            <input 
                              type="text"
                              required
                              value={deductionReason}
                              onChange={(e) => setDeductionReason(e.target.value)}
                              placeholder="Nhập lý do hỏng hoặc mất thiết bị..."
                              className="w-full p-2 bg-white border border-slate-250 rounded-lg outline-none text-slate-800 font-bold text-xs"
                            />
                          </div>
                        </>
                      )}

                    </div>
                  </div>

                  {/* F. ĐỀ XUẤT TẠO HỒ SƠ BẢO TRÌ (Nằm trong form thanh lý) */}
                  {maintenanceRecords.length > 0 && (
                    <div className="bg-amber-50/40 border border-amber-300 rounded-2xl p-4.5 space-y-3 text-left font-semibold">
                      <div className="flex gap-1.5 items-center">
                        <Wrench className="w-4 h-4 text-amber-700 shrink-0" />
                        <h4 className="text-[10.5px] text-[#00236f] font-black uppercase tracking-wider">F. Tạo đề xuất Hồ sơ bảo trì</h4>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">Phát hiện thiết bị bị tổn hao / hư hỏng. Hệ thống tự động đề xuất lập hồ sơ chuyển bảo trì kỹ thuật ngay sau thanh lý.</p>

                      {maintenanceRecords.map((m, idx) => (
                        <div key={idx} className="bg-white border text-[11px] border-amber-200/80 p-3 rounded-xl space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[8px] bg-amber-100 text-amber-800 px-1.5 py-0.5 font-bold rounded font-mono">BẢO TRÌ</span>
                              <strong className="block text-slate-900 font-extrabold mt-1 text-xs">{m.equipmentName} ({m.assetCode})</strong>
                              <span className="text-[9.5px] text-slate-500 block font-mono mt-0.5">Serial: {m.serial}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-1 pt-1.5 border-t border-slate-100 text-xs">
                            <span className="text-slate-400 font-bold block text-[9px]">Lý do bảo trì:</span>
                            <input 
                              type="text"
                              value={m.reason}
                              onChange={(e) => {
                                const cloned = [...maintenanceRecords];
                                cloned[idx].reason = e.target.value;
                                setMaintenanceRecords(cloned);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 p-1.5 rounded text-xs text-slate-800 font-bold"
                            />
                          </div>

                          <div className="space-y-1 text-xs">
                            <span className="text-slate-400 font-bold block text-[9px]">Ghi chú kỹ thuật đầu:</span>
                            <textarea 
                              rows="2"
                              value={m.note}
                              onChange={(e) => {
                                const cloned = [...maintenanceRecords];
                                cloned[idx].note = e.target.value;
                                setMaintenanceRecords(cloned);
                              }}
                              className="w-full bg-slate-50 border border-slate-200 p-1.5 rounded text-xs text-slate-800 font-medium font-sans resize-none"
                            />
                          </div>

                          {m.saved ? (
                            <div className="flex items-center gap-1.5 text-emerald-700 text-[10px] font-black uppercase">
                              <Check className="w-3.5 h-3.5" />
                              Đồng ý tạo phiếu chuyển kho bảo trì
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const cloned = [...maintenanceRecords];
                                cloned[idx].saved = true;
                                setMaintenanceRecords(cloned);
                                showToast('Đã phê duyệt đề cử bảo trì thành phần');
                              }}
                              className="text-[10px] bg-amber-500 hover:bg-amber-600 text-white w-full py-1.5 rounded-lg font-bold uppercase transition"
                            >
                              Phê duyệt chuyển bảo trì
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* G. GHI CHÚ BÀN TRẢ */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-2 text-left font-semibold">
                    <label className="text-[10.5px] text-[#00236f] font-black uppercase block tracking-wider">G. Ghi chú thanh lý dứt điểm</label>
                    <textarea 
                      rows="2.5"
                      value={liquidationNotes}
                      onChange={(e) => setLiquidationNotes(e.target.value)}
                      placeholder="Nhập ghi chú kiểm kê hoặc thông tin cần lưu lại sau khi khách trả thiết bị."
                      className="w-full p-2.5 bg-white border border-slate-250 rounded-xl outline-none text-slate-800 font-bold text-xs"
                    />
                  </div>

                  {/* H. NÚT XÁC NHẬN - CUỐI FORM CHỈ CÓ 2 NÚT HỦY VÀ XÁC NHẬN */}
                  <div className="pt-2 flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => setShowFormModal(false)}
                      className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-250 rounded-xl font-bold uppercase tracking-wider text-slate-700 transition"
                    >
                      Hủy, bỏ qua
                    </button>
                    <button 
                      type="submit"
                      onClick={handleConfirmSubmitLiquidation}
                      disabled={submitting}
                      className={`flex-1 py-3 rounded-xl font-black uppercase tracking-wider shadow-md transition ${submitting ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
                    >
                      {submitting ? 'Đang xử lý...' : 'Xác nhận thanh lý'}
                    </button>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
