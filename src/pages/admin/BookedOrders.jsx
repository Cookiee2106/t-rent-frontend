import React, { useState, useEffect, useRef } from 'react';
import orderApi from '../../api/orderApi';
import { 
  Search, 
  Trash2, 
  Edit3, 
  ArrowLeft,
  Settings,
  ShieldCheck,
  Check,
  Upload,
  UploadCloud,
  FileText
} from 'lucide-react';

const formatVND = (value) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

// Danh sách các thiết bị vật lý rảnh trong kho để đối chiếu mẫu
const MOCK_PHYSICAL_ASSETS_IN_STOCK = [
  { serial: 'SN-A74-884910', modelName: 'Sony Alpha A7 IV', category: 'Máy ảnh' },
  { serial: 'SN-A74-110022', modelName: 'Sony Alpha A7 IV', category: 'Máy ảnh' },
  { serial: 'SN-EOSR5-554401', modelName: 'Canon EOS R5', category: 'Máy ảnh' },
  { serial: 'SN-LENS-2470GM', modelName: 'Sony FE 24-70mm f/2.8 GM ii', category: 'Ống kính' }
];

// Danh sách tương tác phụ kiện khả dụng
const MOCK_ACCESSORIES_FOR_ALLOCATION = [
  { id: 'ACC-01', name: 'Pin Sony NP-FZ100', modelName: 'Sony Alpha A7 IV' },
  { id: 'ACC-02', name: 'Bộ sạc đôi đa năng', modelName: 'Sony Alpha A7 IV' },
  { id: 'ACC-03', name: 'Thẻ nhớ SanDisk 128GB V60', modelName: 'Sony Alpha A7 IV' },
  { id: 'ACC-05', name: 'Pin Canon LP-E6N', modelName: 'Canon EOS R5' },
  { id: 'ACC-04', name: 'Lens Filter Phi 67mm', modelName: 'Sony FE 24-70mm f/2.8 GM ii' }
];

// MOCK TRƯỜNG DỮ LIỆU ĐÒN BÀN GIAO MỚI (CHỌN TÀI SẢN CỤ THỂ)
const MOCK_BODIES_IN_STOCK = [
  { assetCode: 'BODY001', serial: 'SN-A7IV-001', modelName: 'Sony A7 IV', status: 'Sẵn sàng', condition: 'Tốt' },
  { assetCode: 'BODY002', serial: 'SN-A7IV-002', modelName: 'Sony A7 IV', status: 'Sẵn sàng', condition: 'Tốt' },
  { assetCode: 'BODY001_A7', serial: 'SN-A7IV-001', modelName: 'Sony Alpha A7 IV', status: 'Sẵn sàng', condition: 'Tốt' },
  { assetCode: 'BODY002_A7', serial: 'SN-A7IV-002', modelName: 'Sony Alpha A7 IV', status: 'Sẵn sàng', condition: 'Tốt' },
  { assetCode: 'FUJI001', serial: 'SN-FUJI-001', modelName: 'Fuji X-T5', status: 'Sẵn sàng', condition: 'Tốt' },
  { assetCode: 'FUJI002', serial: 'SN-FUJI-001', modelName: 'Fuji X-T5', status: 'Sẵn sàng', condition: 'Tốt' },
  { assetCode: 'FUJI003', serial: 'SN-FUJI-002', modelName: 'Fuji X-T5', status: 'Sẵn sàng', condition: 'Tốt' },
  { assetCode: 'CANON001', serial: 'SN-EOSR5-554401', modelName: 'Canon EOS R5', status: 'Sẵn sàng', condition: 'Tốt' },
  { assetCode: 'CANON002', serial: 'SN-EOSR5-554402', modelName: 'Canon EOS R5', status: 'Sẵn sàng', condition: 'Tốt' }
];

const MOCK_COMPONENTS_IN_STOCK = [
  { assetCode: 'PIN003', serial: 'SN-PIN-S001', componentName: 'Pin NP-FZ100', modelName: 'Sony Alpha A7 IV', status: 'Sẵn sàng', condition: 'Tốt' },
  { assetCode: 'PIN004', serial: 'SN-PIN-S002', componentName: 'Pin NP-FZ100', modelName: 'Sony Alpha A7 IV', status: 'Sẵn sàng', condition: 'Tốt' },
  { assetCode: 'LEN005', serial: 'SN-LEN-S001', componentName: 'Lens 24-70 GM', modelName: 'Sony Alpha A7 IV', status: 'Sẵn sàng', condition: 'Tốt' },
  { assetCode: 'LEN006', serial: 'SN-LEN-S002', componentName: 'Lens 24-70 GM', modelName: 'Sony Alpha A7 IV', status: 'Sẵn sàng', condition: 'Tốt' },

  { assetCode: 'PIN003_A7', serial: 'SN-PIN-S001', componentName: 'Pin NP-FZ100', modelName: 'Sony A7 IV', status: 'Sẵn sàng', condition: 'Tốt' },
  { assetCode: 'PIN004_A7', serial: 'SN-PIN-S002', componentName: 'Pin NP-FZ100', modelName: 'Sony A7 IV', status: 'Sẵn sàng', condition: 'Tốt' },
  { assetCode: 'LEN005_A7', serial: 'SN-LEN-S001', componentName: 'Lens 24-70 GM', modelName: 'Sony A7 IV', status: 'Sẵn sàng', condition: 'Tốt' },
  { assetCode: 'LEN006_A7', serial: 'SN-LEN-S002', componentName: 'Lens 24-70 GM', modelName: 'Sony A7 IV', status: 'Sẵn sàng', condition: 'Tốt' },

  { assetCode: 'PIN008', serial: 'SN-PIN-F001', componentName: 'Pin Fuji NP-W235', modelName: 'Fuji X-T5', status: 'Sẵn sàng', condition: 'Tốt' },
  { assetCode: 'PIN009', serial: 'SN-PIN-F002', componentName: 'Pin Fuji NP-W235', modelName: 'Fuji X-T5', status: 'Sẵn sàng', condition: 'Tốt' },
  { assetCode: 'LEN012', serial: 'SN-LEN-F001', componentName: 'Lens XF 35mm', modelName: 'Fuji X-T5', status: 'Sẵn sàng', condition: 'Tốt' },
  { assetCode: 'LEN013', serial: 'SN-LEN-F002', componentName: 'Lens XF 35mm', modelName: 'Fuji X-T5', status: 'Sẵn sàng', condition: 'Tốt' },

  { assetCode: 'PIN-C1', serial: 'SN-PIN-C1', componentName: 'Pin Canon LP-E6N', modelName: 'Canon EOS R5', status: 'Sẵn sàng', condition: 'Tốt' },
  { assetCode: 'PIN-C2', serial: 'SN-PIN-C2', componentName: 'Pin Canon LP-E6N', modelName: 'Canon EOS R5', status: 'Sẵn sàng', condition: 'Tốt' },
  { assetCode: 'LEN-C1', serial: 'SN-LEN-C1', componentName: 'Lens Canon RF 24-70mm f/2.8 L IS USM', modelName: 'Canon EOS R5', status: 'Sẵn sàng', condition: 'Tốt' },
  { assetCode: 'LEN-C2', serial: 'SN-LEN-C2', componentName: 'Lens Canon RF 24-70mm f/2.8 L IS USM', modelName: 'Canon EOS R5', status: 'Sẵn sàng', condition: 'Tốt' }
];

const MOCK_QUANTITY_IN_STOCK = {
  'Túi Sony': 12,
  'Túi đựng Sony Pro': 12,
  'Túi Fuji': 8,
  'Túi da Fujifilm': 8,
  'Túi chống sốc Canon': 15,
  'Mặc định': 10
};

const GET_PRODUCT_COMPONENTS_MAP = (productName) => {
  const pName = productName || '';
  if (pName.includes('Sony Alpha A7 IV') || pName.includes('Sony A7 IV')) {
    return [
      { name: 'Pin NP-FZ100', type: 'IDENTIFIED_ASSET', required: true },
      { name: 'Lens 24-70 GM', type: 'IDENTIFIED_ASSET', required: true },
      { name: 'Túi Sony', type: 'QUANTITY', required: true, defaultQty: 1, maxQtyAvailable: 12 }
    ];
  }
  if (pName.includes('Canon EOS R5')) {
    return [
      { name: 'Pin Canon LP-E6N', type: 'IDENTIFIED_ASSET', required: true },
      { name: 'Lens Canon RF 24-70mm f/2.8 L IS USM', type: 'IDENTIFIED_ASSET', required: true },
      { name: 'Túi chống sốc Canon', type: 'QUANTITY', required: true, defaultQty: 1, maxQtyAvailable: 15 }
    ];
  }
  if (pName.includes('Fuji X-T5')) {
    return [
      { name: 'Pin Fuji NP-W235', type: 'IDENTIFIED_ASSET', required: true },
      { name: 'Lens XF 35mm', type: 'IDENTIFIED_ASSET', required: true },
      { name: 'Túi Fuji', type: 'QUANTITY', required: true, defaultQty: 1, maxQtyAvailable: 8 }
    ];
  }
  return [
    { name: `Pin sạc cho ${pName}`, type: 'QUANTITY', required: true, defaultQty: 1, maxQtyAvailable: 10 },
    { name: `Lồng bảo vệ cho ${pName}`, type: 'QUANTITY', required: true, defaultQty: 1, maxQtyAvailable: 10 },
    { name: `Túi đựng tiêu chuẩn`, type: 'QUANTITY', required: true, defaultQty: 1, maxQtyAvailable: 10 }
  ];
};

const STATUS_MAP = {
  'PENDING_DEPOSIT': 'Chờ thanh toán cọc',
  'CHO_XU_LY': 'Chờ thanh toán cọc',
  'RESERVED': 'Đã đặt cọc',
  'DA_GIU_CHO': 'Đã đặt cọc',
  'RENTING': 'Đang thuê',
  'DANG_THUE': 'Đang thuê',
  'COMPLETED': 'Hoàn thành',
  'HOAN_THANH': 'Hoàn thành',
  'CANCELLED': 'Đã hủy',
  'DA_HUY': 'Đã hủy',
};

const mapOrder = (o) => {
  const rawVerify = o.customer_profiles?.verification_status || o.ho_so_khach_hang?.trang_thai_xac_minh || o.khach_hang?.trang_thai_xac_minh;
  let customerVerification = 'Chưa xác minh';
  if (rawVerify === 'APPROVED' || rawVerify === 'DA_DUYET') {
    customerVerification = 'Đã duyệt';
  } else if (rawVerify === 'PENDING' || rawVerify === 'CHO_DUYET') {
    customerVerification = 'Chờ duyệt';
  } else if (rawVerify === 'REJECTED' || rawVerify === 'TU_CHOI') {
    customerVerification = 'Bị từ chối';
  }

  return {
    id: o.id,
    orderCode: o.order_code || o.ma_don || '',
    customerName: o.customer_profiles?.users?.full_name || o.ho_so_khach_hang?.nguoi_dung?.ho_ten || o.khach_hang?.ho_ten || '',
    customerEmail: o.customer_profiles?.users?.email || o.ho_so_khach_hang?.nguoi_dung?.email || o.khach_hang?.email || '',
    customerPhone: o.customer_profiles?.users?.phone || o.ho_so_khach_hang?.nguoi_dung?.so_dien_thoai || o.khach_hang?.so_dien_thoai || '',
    startDate: o.start_date?.split('T')[0] || o.ngay_nhan?.split('T')[0] || o.start_date || o.ngay_nhan,
    endDate: o.end_date?.split('T')[0] || o.ngay_tra?.split('T')[0] || o.end_date || o.ngay_tra,
    totalPrice: Number(o.total_rental_amount || o.tong_tien_thue) || 0,
    deposit: Number(o.total_deposit_amount || o.tong_tien_coc) || 0,
    status: STATUS_MAP[o.status || o.trang_thai] || o.status || o.trang_thai,
    equipments: (o.rental_order_items || o.chi_tiet_don_thue || []).map(item => ({
      id: item.id,
      productModelId: item.product_models?.id || item.mau_thiet_bi_id || item.mau_thiet_bi?.id || '',
      name: item.product_models?.name || item.mau_thiet_bi?.ten_mau || item.ten_mau || '',
      qty: item.quantity || item.so_luong || 1,
      price: Number(item.daily_price_snapshot || item.gia_thue_ngay_snapshot || item.price) || 0,
      deposit: Number(item.deposit_amount_snapshot || item.tien_coc_snapshot || item.deposit) || 0,
    })),
    customerVerification,
    cancelReason: o.cancel_reason || o.ly_do_huy || '',
    rawStatus: o.status || o.trang_thai,
  };
};

export default function BookedOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableAssets, setAvailableAssets] = useState([]);
  const [loadingAssets, setLoadingAssets] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderApi.admin.getOrders();
      const rawData = res.data?.data;
      const rawOrders = Array.isArray(rawData) ? rawData 
                      : Array.isArray(rawData?.danh_sach) ? rawData.danh_sach
                      : Array.isArray(res.data) ? res.data
                      : [];
      setOrders(rawOrders.map(mapOrder));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [activeView, setActiveView] = useState('list'); // 'list' | 'detail' | 'handover'
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Chọn tài sản cụ thể dạng danh sách accordion mở rộng cho bộ thiết bị
  const [unitHandoverSelections, setUnitHandoverSelections] = useState([]);
  const [highlightedBlockIndex, setHighlightedBlockIndex] = useState(-1);

  // Bộ lọc tìm kiếm danh sách mới theo yêu cầu:
  // Mã đơn hàng, Tên khách hàng, Ngày nhận, Ngày trả, Trạng thái đơn hàng
  const [filterCode, setFilterCode] = useState('');
  const [filterCustomer, setFilterCustomer] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Trạng thái Form lập phiếu bàn giao
  const [hoName, setHoName] = useState('');
  const [hoEmail, setHoEmail] = useState('');
  const [hoPhone, setHoPhone] = useState('');
  const [hoVerification, setHoVerification] = useState('');

  const [hoCode, setHoCode] = useState('');
  const [hoStartDate, setHoStartDate] = useState('');
  const [hoEndDate, setHoEndDate] = useState('');
  const [hoDays, setHoDays] = useState(1);
  const [hoTotalPrice, setHoTotalPrice] = useState(0);
  const [hoDeposit, setHoDeposit] = useState(0);
  const [hoStatus, setHoStatus] = useState('');

  // Khu vực chọn tài sản cụ thể:
  const [hoAssetCode, setHoAssetCode] = useState('');
  const [hoAssetName, setHoAssetName] = useState('');
  const [hoAssetSerial, setHoAssetSerial] = useState('');
  const [hoAssetDesc, setHoAssetDesc] = useState('');
  const [hoAssetStateBefore, setHoAssetStateBefore] = useState('');
  const [hoAssetStatusMsg, setHoAssetStatusMsg] = useState('');

  // Phụ kiện đi kèm
  const [hoAccName, setHoAccName] = useState('');
  const [hoAccQtyNeeded, setHoAccQtyNeeded] = useState(1);
  const [hoAccQtyActual, setHoAccQtyActual] = useState(1);
  const [hoAccNotes, setHoAccNotes] = useState('');

  // File hợp đồng giấy
  const [hoContractFile, setHoContractFile] = useState(null); // { name, type, size }
  // Ảnh bàn giao
  const [hoHandoverFile, setHoHandoverFile] = useState(null); // { name, type, size }

  // Ghi chú bàn giao
  const [hoNotes, setHoNotes] = useState('');

  // File refs for real file uploads
  const contractFileInputRef = useRef(null);
  const handoverFileInputRef = useRef(null);
  const [uploadingContract, setUploadingContract] = useState(false);
  const [uploadingHandover, setUploadingHandover] = useState(false);
  const [submittingHandover, setSubmittingHandover] = useState(false);
  // Store uploaded URLs from API 12 to pass to API 13
  const [uploadedHandoverImageUrls, setUploadedHandoverImageUrls] = useState([]);

  const [toastMsg, setToastMsg] = useState(null);

  const triggerToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleOpenDetail = (ord) => {
    setSelectedOrder(ord);
    setActiveView('detail');
  };

  const computedDays = (st, en) => {
    const d1 = new Date(st);
    const d2 = new Date(en);
    if (isNaN(d1) || isNaN(d2)) return 1;
    const diff = Math.abs(d2 - d1);
    return Math.ceil(diff / (1000 * 60 * 60 * 24)) || 1;
  };

  // Bắt đầu Lập phiếu bàn giao từ danh sách
  const handleStartHandoverDirect = async (o) => {
    if (!['RESERVED', 'DA_GIU_CHO'].includes(o.rawStatus)) {
      alert('Đơn hàng chưa đủ điều kiện lập phiếu bàn giao');
      return;
    }
    
    setSelectedOrder(o);
    
    // Nạp thông tin khách hàng
    setHoName(o.customerName || '');
    setHoEmail(o.customerEmail || '');
    setHoPhone(o.customerPhone || '');
    setHoVerification(o.customerVerification || 'Chưa xác minh');

    // Nạp thông tin đơn hàng
    setHoCode(o.orderCode || '');
    setHoStartDate(o.startDate || '');
    setHoEndDate(o.endDate || '');
    setHoDays(computedDays(o.startDate, o.endDate));
    setHoTotalPrice(o.totalPrice || 0);
    setHoDeposit(o.deposit || 0);
    setHoStatus(o.status || '');

    // Reset upload và ghi chú
    setHoContractFile(null);
    setHoHandoverFile(null);
    setHoNotes('Thiết bị chuẩn sạch chuẩn khớp tem niêm phong niêm yết.');

    // Nạp danh sách tài sản sẵn sàng từ database qua API
    setAvailableAssets([]);
    try {
      setLoadingAssets(true);
      const res = await orderApi.admin.getAvailableAssets(o.id);
      const rawAssets = res.data?.data?.tai_san_san_sang || res.data?.tai_san_san_sang || [];
      setAvailableAssets(rawAssets);
    } catch (err) {
      console.error("Lỗi khi tải tài sản sẵn sàng từ BE:", err);
    } finally {
      setLoadingAssets(false);
    }

    // Khởi tạo các combo chọn tài sản cho từng bộ thiết bị trong đơn hàng (Flat list)
    const initialSelections = [];
    o.equipments.forEach((eq, eqIdx) => {
      const componentSchemas = GET_PRODUCT_COMPONENTS_MAP(eq.name);
      
      for (let i = 0; i < eq.qty; i++) {
        // Tự động gán cho phụ kiện đi kèm loại Identified Asset (bắt đầu bằng rỗng)
        const includedSelections = componentSchemas.map((schema, sIdx) => {
          if (schema.type === 'IDENTIFIED_ASSET') {
            return {
              includedItemName: schema.name,
              managementType: 'IDENTIFIED_ASSET',
              assetId: '', // Bắt đầu bằng rỗng để hiển thị 0/4 thành phần ban đầu
              stateBefore: 'Tốt',
              notes: 'Sẵn sàng bàn giao',
              required: schema.required
            };
          } else {
            return {
              includedItemName: schema.name,
              managementType: 'QUANTITY',
              quantity: schema.defaultQty || 1, // Số lượng mặc định: 1
              stateBefore: '-',
              notes: 'Bàn giao đủ phụ kiện',
              required: schema.required
            };
          }
        });

        initialSelections.push({
          orderItemId: eq.id || `eq-${eqIdx}-${Date.now()}`,
          productModelId: eq.productModelId,
          productName: eq.name,
          unitIndex: i + 1,
          bodyAssetId: '', // Máy chính bắt đầu bằng rỗng để hiển thị 0/4 thành phần ban đầu
          bodyStateBefore: 'Tốt',
          bodyNotes: 'Kiểm tra khớp sê-ri chuẩn',
          includedSelections
        });
      }
    });

    setUnitHandoverSelections(initialSelections);
    setHighlightedBlockIndex(-1);
    setActiveView('handover');
  };

  // Hàm tự kiểm nghiệm từng ProductSection
  const validateUnitBlock = (block, allBlocks) => {
    // 1. Kiểm tra đã chọn body chính chưa
    if (!block.bodyAssetId) return 'Chưa chọn đủ';

    // Đánh giá xem body đó có khả dụng không (check DB trước, sau đó là Mock)
    const isDbBody = availableAssets.some(a => a.id === block.bodyAssetId);
    if (!isDbBody) {
      const matchedBody = MOCK_BODIES_IN_STOCK.find(b => b.assetCode === block.bodyAssetId);
      if (!matchedBody || (matchedBody.status !== 'Sẵn sàng' && matchedBody.status !== 'S?n sng')) {
        return 'Thiếu tài sản';
      }
    }

    // Kiểm tra trùng sê-ri body
    const bodyCollision = allBlocks.some(other => other !== block && other.bodyAssetId === block.bodyAssetId);
    if (bodyCollision) return 'Chưa chọn đủ';

    // 2. Đi qua các thành phần phụ kiện
    for (const comp of block.includedSelections) {
      if (comp.managementType === 'IDENTIFIED_ASSET') {
        if (comp.required && !comp.assetId) {
          return 'Chưa chọn đủ';
        }

        if (comp.assetId) {
          const isDbComp = availableAssets.some(a => a.id === comp.assetId);
          if (!isDbComp) {
            const matchedComp = MOCK_COMPONENTS_IN_STOCK.find(c => c.assetCode === comp.assetId);
            if (!matchedComp || (matchedComp.status !== 'Sẵn sàng' && matchedComp.status !== 'S?n sng')) {
              return 'Thiếu tài sản'; // Phụ kiện không còn sẵn sàng
            }
          }

          // Kiểm tra trùng serial phụ kiện giữa các bộ hoặc dòng khác
          const compCollision = allBlocks.some(otherBlock => {
            return otherBlock.includedSelections.some(otherComp => {
              if (otherBlock === block && otherComp === comp) return false;
              return otherComp.assetId === comp.assetId && otherComp.assetId !== '';
            });
          });

          if (compCollision) return 'Chưa chọn đủ';
        }
      } else {
        // Loại Số lượng
        if (comp.required && (comp.quantity === undefined || comp.quantity < 1)) {
          return 'Chưa chọn đủ';
        }
        const limitAvailable = MOCK_QUANTITY_IN_STOCK[comp.includedItemName] || MOCK_QUANTITY_IN_STOCK['Mặc định'];
        if (comp.quantity > limitAvailable) {
          return 'Thiếu tài sản'; // Vượt quá tồn kho khả dụng
        }
      }
    }

    return 'Đã chọn đủ';
  };

  // Khi bấm nút "Kiểm tra tài sản đã chọn" ở cuối khu vực chọn tài sản
  const handleCheckSelections = () => {
    let errors = [];
    let firstErrorIdx = -1;

    unitHandoverSelections.forEach((block, idx) => {
      const cleanName = block.productName.includes('Sony') ? 'Sony A7 IV' : (block.productName.includes('Fuji') ? 'Fuji X-T5' : block.productName);
      const blockLabel = `${cleanName} #${block.unitIndex}`;
      
      // Kiểm tra body chính
      if (!block.bodyAssetId) {
        errors.push(`Vui lòng chọn body chính cho ${blockLabel}`);
        if (firstErrorIdx === -1) firstErrorIdx = idx;
      } else {
        const isDb = availableAssets.some(a => a.id === block.bodyAssetId);
        const body = isDb ? { assetCode: block.bodyAssetId } : MOCK_BODIES_IN_STOCK.find(b => b.assetCode === block.bodyAssetId);
        if (!body) {
          errors.push(`Vui lòng chọn body chính cho ${blockLabel}`);
          if (firstErrorIdx === -1) firstErrorIdx = idx;
        } else {
          const duplicated = unitHandoverSelections.some(other => other !== block && other.bodyAssetId === block.bodyAssetId);
          if (duplicated) {
            errors.push(`Tài sản này đã được chọn trong bộ khác`);
            if (firstErrorIdx === -1) firstErrorIdx = idx;
          }
        }
      }

      // Kiểm tra thành phần đi kèm
      block.includedSelections.forEach(comp => {
        if (comp.managementType === 'IDENTIFIED_ASSET') {
          if (comp.required && !comp.assetId) {
            errors.push(`Vui lòng chọn đủ thành phần đi kèm cho ${blockLabel}`);
            if (firstErrorIdx === -1) firstErrorIdx = idx;
          } else if (comp.assetId) {
            const duplicatedComp = unitHandoverSelections.some(otherBlock => {
              return otherBlock.includedSelections.some(otherComp => {
                if (otherBlock === block && otherComp === comp) return false;
                return otherComp.assetId === comp.assetId && otherComp.assetId !== '';
              });
            });
            if (duplicatedComp) {
              errors.push(`Tài sản này đã được chọn trong bộ khác`);
              if (firstErrorIdx === -1) firstErrorIdx = idx;
            }
          }
        } else {
          // Số lượng
          if (comp.required && (comp.quantity === undefined || comp.quantity < 1)) {
            errors.push(`Vui lòng chọn đủ thành phần đi kèm cho ${blockLabel}`);
            if (firstErrorIdx === -1) firstErrorIdx = idx;
          } else {
            const limit = MOCK_QUANTITY_IN_STOCK[comp.includedItemName] || MOCK_QUANTITY_IN_STOCK['Mặc định'];
            if (comp.quantity > limit) {
              errors.push(`Số lượng phụ kiện bàn giao vượt quá số lượng khả dụng`);
              if (firstErrorIdx === -1) firstErrorIdx = idx;
            }
          }
        }
      });
    });

    if (errors.length > 0) {
      alert(errors[0]); // Hiển thị lỗi đầu tiên rõ ràng nhất
      setHighlightedBlockIndex(firstErrorIdx);
      triggerToast("Kiểm tra thấy thông tin chưa chọn đủ.");
      return false;
    } else {
      setHighlightedBlockIndex(-1);
      alert("Đã chọn đủ tài sản cụ thể cho đơn hàng");
      triggerToast("Đã chọn đủ tài sản cụ thể cho đơn hàng");
      return true;
    }
  };

  // Giả lập chọn nhanh sê-ri bộ
  const handleSelectAssetModel = (asset) => {
    // Không làm lỗi form, gán trực tiếp cho combo đầu tiên nếu còn dùng
    if (unitHandoverSelections.length > 0) {
      const updated = [...unitHandoverSelections];
      updated[0].bodyAssetId = asset.assetCode;
      setUnitHandoverSelections(updated);
      triggerToast(`Đã gán nhanh Máy: ${asset.serial}`);
    }
  };

  // Upload file hợp đồng giấy qua API 11
  const handleUploadContract = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingContract(true);
      await orderApi.admin.uploadContractFile(selectedOrder.id, file);
      setHoContractFile({ name: file.name, type: file.type, size: `${(file.size / 1024 / 1024).toFixed(1)} MB` });
      triggerToast('Tải lên file hợp đồng giấy thành công');
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Lỗi khi tải lên hợp đồng');
    } finally {
      setUploadingContract(false);
    }
  };

  // Upload ảnh bàn giao qua API 12
  const handleUploadHandoverImages = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    try {
      setUploadingHandover(true);
      const res = await orderApi.admin.uploadHandoverImages(selectedOrder.id, files);
      const images = res.data?.data?.danh_sach_anh || res.data?.data?.images || [];
      setUploadedHandoverImageUrls(images);
      setHoHandoverFile({ name: `${files.length} ảnh bàn giao`, type: files[0].type, size: `${files.length} file(s)` });
      triggerToast('Tải lên ảnh bàn giao thành công');
    } catch (err) {
      triggerToast(err.response?.data?.message || 'Lỗi khi tải lên ảnh bàn giao');
    } finally {
      setUploadingHandover(false);
    }
  };

  // Xác nhận lưu Lập phiếu bàn giao qua API 13
  const handleSubmitHandover = async (e) => {
    e.preventDefault();

    // Validate 1: Đơn hàng chưa đủ điều kiện
    if (!['RESERVED', 'DA_GIU_CHO'].includes(selectedOrder.rawStatus)) {
      alert('Đơn hàng chưa đủ điều kiện lập phiếu bàn giao');
      return;
    }

    // Validate 2: Kiểm tra đã chọn đủ tài sản
    let hasEmptySelection = unitHandoverSelections.some(block => {
      if (!block.bodyAssetId) return true;
      return block.includedSelections.some(comp => comp.managementType === 'IDENTIFIED_ASSET' && comp.required && !comp.assetId);
    });
    if (hasEmptySelection) {
      alert('Vui lòng chọn đủ tài sản cụ thể');
      return;
    }

    // Validate 3: Kiểm tra trùng lặp
    let checkOk = true;
    unitHandoverSelections.forEach((block) => {
      const stateLabel = validateUnitBlock(block, unitHandoverSelections);
      if (stateLabel !== 'Đã chọn đủ') checkOk = false;
    });
    if (!checkOk) {
      alert('Thông tin tài sản cụ thể chưa hợp lệ. Vui lòng bấm "Kiểm tra tài sản đã chọn" để biết thêm chi tiết.');
      return;
    }

    // Validate 4: Phải upload hợp đồng và ảnh
    if (!hoContractFile || !hoHandoverFile) {
      alert('Vui lòng upload ảnh hoặc file hợp đồng giấy');
      return;
    }

    // Gom dữ liệu assets theo format Backend yêu cầu (dùng thuộc tính tiếng Việt)
    const assetsPayload = unitHandoverSelections.map(block => {
      const allAssetIds = [
        block.bodyAssetId, 
        ...block.includedSelections.filter(s => s.managementType === 'IDENTIFIED_ASSET' && s.assetId).map(s => s.assetId)
      ].filter(Boolean);
      return {
        mau_thiet_bi_id: block.productModelId || block.orderItemId, // maps to model ID
        danh_sach_tai_san_id: allAssetIds
      };
    });

    try {
      setSubmittingHandover(true);
      await orderApi.admin.createHandover(selectedOrder.id, {
        danh_sach_tai_san: assetsPayload,
        danh_sach_anh_url: uploadedHandoverImageUrls,
        ghi_chu: hoNotes
      });
      triggerToast('Lập phiếu bàn giao thành công!');
      fetchOrders(); // Reload danh sách
      setActiveView('list');
    } catch (err) {
      alert(err.response?.data?.message || 'Lỗi khi lập phiếu bàn giao');
    } finally {
      setSubmittingHandover(false);
    }
  };

  // Hủy đơn hàng nếu khách chưa nhận máy
  const handleCancelOrder = () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này và giải phóng thiết bị đặt chỗ?')) {
      const updated = {
        ...selectedOrder,
        status: 'Đã hủy'
      };
      setOrders(orders.map(o => o.orderCode === selectedOrder.orderCode ? updated : o));
      setSelectedOrder(updated);
      triggerToast('Đã hủy đơn hàng thành công!');
    }
  };

  // Lọc danh sách theo đúng 5 tham số được định sẵn: Mã đơn hàng, Tên khách hàng, Ngày nhận, Ngày trả, Trạng thái đơn hàng
  const filteredOrders = orders.filter(o => {
    const matchesCode = filterCode === '' || o.orderCode.toLowerCase().includes(filterCode.toLowerCase());
    const matchesCustomer = filterCustomer === '' || o.customerName.toLowerCase().includes(filterCustomer.toLowerCase());
    const matchesStartDate = filterStartDate === '' || o.startDate === filterStartDate;
    const matchesEndDate = filterEndDate === '' || o.endDate === filterEndDate;
    const matchesStatus = statusFilter === '' || o.status === statusFilter;
    return matchesCode && matchesCustomer && matchesStartDate && matchesEndDate && matchesStatus;
  });

  return (
    <div className="space-y-6 select-none font-sans text-left" id="booked-orders-screen">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-4 bg-[#0a1128] text-white px-5 py-3.5 rounded-lg shadow-2xl z-50 flex items-center gap-2 border border-slate-700 animate-slideIn">
          <Check className="w-5 h-5 text-[#fea619]" />
          <span className="text-xs font-bold">{toastMsg}</span>
        </div>
      )}

      {/* VIEW: 1. LIST ORDERS */}
      {activeView === 'list' && (
        <>
          {/* Breadcrumb */}
          <div className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
            Trang chủ / Quản lý đơn hàng
          </div>

          <div className="flex flex-wrap justify-between items-center bg-white p-5 border border-[#c5c5d3] rounded-2xl shadow-xs gap-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-[#00236f] flex items-center gap-2 uppercase tracking-wide">
                <FileText className="w-5 h-5 text-indigo-650" />
                Quản lý đơn hàng
              </h2>
              <p className="text-xs text-slate-500 mt-1 font-semibold">Theo dõi hồ sơ đặt chỗ thiết bị quay phim chụp hình và làm thủ tục bàn giao chuyên nghiệp</p>
            </div>
          </div>

          {/* Filters strip containing exactly the 5 specified fields */}
          <div className="bg-white p-4.5 border border-slate-200 rounded-xl shadow-xs grid grid-cols-1 sm:grid-cols-5 gap-3 items-end text-xs mb-6">
            <div>
              <label className="block text-slate-500 font-bold mb-1 text-[10px] uppercase">Mã đơn hàng</label>
              <input 
                type="text"
                placeholder="Ví dụ: TR-ORD-5001"
                value={filterCode}
                onChange={(e) => setFilterCode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3 py-2 outline-none font-bold text-slate-700 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1 text-[10px] uppercase">Tên khách hàng</label>
              <input 
                type="text"
                placeholder="Nhập tên..."
                value={filterCustomer}
                onChange={(e) => setFilterCustomer(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3 py-2 outline-none font-bold text-slate-700 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1 text-[10px] uppercase">Ngày nhận</label>
              <input 
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3 py-2 outline-none font-bold text-slate-700 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1 text-[10px] uppercase">Ngày trả</label>
              <input 
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-205 rounded-xl px-3 py-2 outline-none font-bold text-slate-700 text-xs"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1 text-[10px] uppercase">Trạng thái đơn hàng</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white border border-slate-202 rounded-xl p-2 outline-none font-extrabold text-slate-650 cursor-pointer text-xs"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="Chờ bàn giao">Chờ bàn giao</option>
                <option value="Đang thuê">Đang thuê</option>
                <option value="Đã trả máy">Đã trả máy</option>
                <option value="Hoàn thành">Hoàn thành</option>
                <option value="Đã hủy">Đã hủy</option>
              </select>
            </div>
          </div>

          {/* Table display */}
          <div className="table-wrapper border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="w-full">
              <table className="data-table text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-semibold text-[#0f172a] text-[13px]">
                    <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[110px]">Mã đơn hàng</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-left font-semibold min-w-[150px]">Khách hàng</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-center font-semibold min-w-[110px]">Ngày nhận</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-center font-semibold min-w-[110px]">Ngày trả</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-center font-semibold min-w-[100px]">Số ngày</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-right font-semibold min-w-[125px]">Thành tiền</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-right font-semibold min-w-[125px]">Tiền cọc</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-center font-semibold min-w-[130px]">Trạng thái</th>
                    <th className="px-6 py-3.5 whitespace-nowrap text-right font-semibold min-w-[130px]">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-705">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-6 py-10 text-center italic text-slate-400 font-bold">
                        Không tìm thấy đơn hàng thuê nào.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(o => {
                      return (
                        <tr key={o.orderCode} className="hover:bg-slate-100/30 transition">
                          <td className="px-6 py-4 font-mono font-bold text-[#00236f] cell-code">{o.orderCode}</td>
                          <td className="px-6 py-4 font-bold text-slate-900">{o.customerName}</td>
                          <td className="px-6 py-4 font-mono text-center cell-date">{o.startDate}</td>
                          <td className="px-6 py-4 font-mono text-center cell-date">{o.endDate}</td>
                          <td className="px-6 py-4 text-center font-bold text-slate-800">{computedDays(o.startDate, o.endDate)} ngày</td>
                          <td className="px-6 py-4 text-right font-mono font-bold text-[#00236f] cell-money">{formatVND(o.totalPrice)}</td>
                          <td className="px-6 py-4 text-right font-mono font-bold text-indigo-700 cell-money">{formatVND(o.deposit)}</td>
                          <td className="px-6 py-4 text-center">
                            <span className={`status-badge border leading-none ${
                              ['RESERVED', 'DA_GIU_CHO'].includes(o.rawStatus) ? 'bg-amber-50 text-amber-805 border-amber-200' :
                              ['RENTING', 'DANG_THUE'].includes(o.rawStatus) ? 'bg-indigo-50 text-indigo-805 border-indigo-200' :
                              ['COMPLETED', 'HOAN_THANH'].includes(o.rawStatus) ? 'bg-green-50 text-green-708 border-green-200' :
                              ['CANCELLED', 'DA_HUY'].includes(o.rawStatus) ? 'bg-rose-50 text-rose-600 border-rose-200' :
                              'bg-slate-50 text-slate-500 border-slate-200'
                            }`}>
                              {o.status}
                              {['CANCELLED', 'DA_HUY'].includes(o.rawStatus) && o.cancelReason && (
                                <span className="ml-1 text-[9px] font-normal opacity-70">({o.cancelReason})</span>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="table-action-group justify-end text-xs">
                              <button
                                type="button"
                                onClick={() => handleOpenDetail(o)}
                                className="table-action-button text-[#00236f] bg-[#00236f]/5 hover:bg-[#00236f]/10 cursor-pointer"
                              >
                                Xem chi tiết
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStartHandoverDirect(o)}
                                className={`table-action-button transition cursor-pointer font-semibold ${
                                  ['RESERVED', 'DA_GIU_CHO'].includes(o.rawStatus)
                                    ? 'bg-[#00236f] text-white hover:bg-slate-800'
                                    : 'bg-slate-50 text-slate-400 border border-slate-200 cursor-not-allowed'
                                }`}
                              >
                                {['RESERVED', 'DA_GIU_CHO'].includes(o.rawStatus) ? 'Lập phiếu bàn giao' : 'Đã lập phiếu'}
                              </button>
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
        </>
      )}

      {/* VIEW: 2. DETAILED ORDER VIEW */}
      {activeView === 'detail' && selectedOrder && (
        <div className="bg-white border border-[#c5c5d3] p-6 rounded-2xl shadow-xs space-y-6">
          <div className="flex border-b pb-4 items-center justify-between">
            <button 
              type="button" 
              onClick={() => setActiveView('list')}
              className="text-slate-500 hover:text-slate-900 font-bold flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại danh sách
            </button>
            <span className="text-[10px] uppercase font-mono font-bold text-slate-400">Chi tiết hóa đơn dán sườn: #{selectedOrder.orderCode}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs font-semibold">
            
            <div className="md:col-span-8 space-y-6 text-left">
              
              {/* Customer Box */}
              <div className="bg-slate-50 border border-slate-150 p-4.5 rounded-2xl text-slate-700 space-y-3.5">
                <span className="text-[10px] font-black text-slate-450 block uppercase tracking-widest border-b border-slate-200 pb-1.5">Thông tin đăng ký khách</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400 font-bold block mb-0.5">Khách hàng thuê máy:</span>
                    <strong className="text-slate-900 font-bold block text-sm">{selectedOrder.customerName}</strong>
                    <span className="text-[10.5px] text-green-700 font-black mt-0.5 block">🛡️ {selectedOrder.customerVerification}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold block mb-0.5">Số điện thoại / Liên lạc:</span>
                    <span className="text-slate-800 text-sm font-bold block">{selectedOrder.customerPhone}</span>
                    <span className="text-slate-405 block mt-0.5">{selectedOrder.customerEmail}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/90 text-[11px] font-medium text-indigo-700 font-bold">
                  📅 Kì hạn cho thuê: Từ {selectedOrder.startDate} đến hết {selectedOrder.endDate} (Hợp đồng thuê 48h)
                </div>
              </div>

              {/* Equipments Requested details */}
              <div className="bg-slate-50 border border-slate-150 p-4.5 rounded-2xl text-slate-705 space-y-3">
                <span className="text-[10px] font-black text-slate-450 block uppercase tracking-widest border-b border-slate-200 pb-1.5 font-sans">
                  Thiết bị &amp; Linh kiện kèm theo được gán định danh
                </span>
                
                {selectedOrder.equipments.map((eq, i) => (
                  <div key={i} className="bg-white p-3 border border-slate-200 rounded-xl space-y-2.5">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <strong className="text-[#00236f] text-sm block font-black leading-tight">{eq.name}</strong>
                        <span className="text-[10.5px] text-slate-400 font-bold block mt-1">Giá trị thuê: {formatVND(eq.price)}/ngày | Tiền đặt cọc mốc máy: {formatVND(eq.deposit)}</span>
                      </div>
                      <span className="text-slate-700 bg-slate-100 font-black px-2.5 py-0.5 rounded">{eq.qty} chiếc</span>
                    </div>

                    <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block mb-0.5">Mã sê-ri máy thực tế gán xuất:</span>
                        {eq.allocatedSerial ? (
                          <strong className="text-indigo-650 font-mono text-sm block font-black">⚙️ {eq.allocatedSerial}</strong>
                        ) : (
                          <span className="text-rose-550 italic font-bold">Quầy bàn quầy chưa cấp sê-ri cụ thể</span>
                        )}
                      </div>

                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block mb-0.5">Phụ kiện tương thích đi kèm:</span>
                        {eq.allocatedAccessories && eq.allocatedAccessories.length > 0 ? (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {eq.allocatedAccessories.map(name => (
                              <span key={name} className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10px] text-slate-755 font-bold">📦 {name}</span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-402 italic font-semibold">Chưa gán gộp phụ kiện rời bổ trợ</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Photos upload preview if exists */}
              {selectedOrder.handoverPhotos && selectedOrder.handoverPhotos.length > 0 && (
                <div className="bg-slate-50 border p-4.5 rounded-2xl text-slate-707 space-y-3">
                  <span className="text-[10px] font-black text-slate-450 block uppercase tracking-widest border-b pb-1">Ảnh chụp hiện trạng bàn giao thực tế:</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedOrder.handoverPhotos.map(ph => (
                      <div key={ph} className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded font-mono font-bold text-[10.5px]">
                        📸 {ph} (Ảnh đợt giao)
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Side Action Column inside detailed */}
            <div className="md:col-span-4 p-4 bg-slate-50 border border-slate-205 rounded-2xl flex flex-col justify-between space-y-4 font-sans">
              <div>
                <span className="text-[9px] block text-slate-400 font-black uppercase mb-1">Nghiệp vụ quầy</span>
                
                {selectedOrder.rawStatus === 'RESERVED' ? (
                  <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
                    Khách đã ký quỹ đặt cọc thô trực tuyến. Vui lòng tiến hành <strong>Lập phiếu bàn giao</strong> từ màn hình danh sách đơn hàng.
                  </p>
                ) : (
                  <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
                    Đơn hàng thuê đang vận hành ngoài bãi hoặc hoàn tất kiểm tra. Hồ sơ bàn giao mã {selectedOrder.handoverSlipCode || 'Chưa lập'} đã gác sổ.
                  </p>
                )}
              </div>

              <div className="space-y-2 text-center font-bold">
                <div className="p-3 bg-slate-100 text-slate-500 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-wider">
                  Trạng thái đơn: {selectedOrder.status}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW: 3. LẬP PHIẾU BÀN GIAO */}
      {activeView === 'handover' && selectedOrder && (
        <form onSubmit={handleSubmitHandover} className="bg-white border border-[#c5c5d3] p-8 rounded-2xl shadow-xs text-xs space-y-8 font-semibold text-slate-700 text-left">
          <div className="border-b pb-4">
            <h3 className="text-lg font-black text-[#00236f] uppercase flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-650" />
              LẬP PHIẾU BÀN GIAO THIẾT BỊ
            </h3>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Vui lòng cập nhật các khu vực thông tin nghiệp vụ nhằm lưu trữ hồ sơ bàn giao chuẩn chỉ.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* KHU VỰC THÔNG TIN KHÁCH HÀNG */}
            <div className="bg-slate-50/70 p-5 border border-slate-200 rounded-xl space-y-3">
              <h4 className="text-[#00236f] font-black text-xs uppercase tracking-wider border-b pb-1.5 flex items-center justify-between">
                <span>👤 Khu vực thông tin khách hàng</span>
                <span className="text-[9.5px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded uppercase font-bold">Xác minh</span>
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Họ tên khách hàng</label>
                  <input 
                    type="text"
                    value={hoName}
                    onChange={(e) => setHoName(e.target.value)}
                    className="w-full bg-white border border-slate-205 rounded-lg px-3 py-2 outline-none font-bold text-slate-800 focus:border-[#00236f]"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Email</label>
                  <input 
                    type="email"
                    value={hoEmail}
                    onChange={(e) => setHoEmail(e.target.value)}
                    className="w-full bg-white border border-slate-205 rounded-lg px-3 py-2 outline-none font-bold text-slate-800 focus:border-[#00236f]"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Số điện thoại</label>
                  <input 
                    type="text"
                    value={hoPhone}
                    onChange={(e) => setHoPhone(e.target.value)}
                    className="w-full bg-white border border-slate-205 rounded-lg px-3 py-2 outline-none font-bold text-slate-800 focus:border-[#00236f]"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Trạng thái xác minh</label>
                  <input 
                    type="text"
                    value={hoVerification}
                    onChange={(e) => setHoVerification(e.target.value)}
                    className="w-full bg-white border border-slate-205 rounded-lg px-3 py-2 outline-none font-bold text-slate-800 focus:border-[#00236f]"
                  />
                </div>
              </div>
            </div>

            {/* KHU VỰC THÔNG TIN ĐƠN HÀNG */}
            <div className="bg-slate-50/70 p-5 border border-slate-200 rounded-xl space-y-3">
              <h4 className="text-[#00236f] font-black text-xs uppercase tracking-wider border-b pb-1.5">
                📦 Khu vực thông tin đơn hàng
              </h4>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Mã đơn hàng</label>
                    <input 
                      type="text"
                      value={hoCode}
                      readOnly
                      className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 outline-none font-bold text-slate-500 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Trạng thái đơn hàng</label>
                    <span className="inline-block mt-2 px-2.5 py-1 bg-amber-50 text-amber-800 rounded font-black text-[10px] uppercase border border-amber-200">
                      {hoStatus}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Ngày nhận</label>
                    <input 
                      type="date"
                      value={hoStartDate}
                      onChange={(e) => {
                        setHoStartDate(e.target.value);
                        setHoDays(computedDays(e.target.value, hoEndDate));
                      }}
                      className="w-full bg-white border border-slate-205 rounded-lg px-3 py-2 outline-none font-bold text-slate-800 focus:border-[#00236f]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Ngày trả</label>
                    <input 
                      type="date"
                      value={hoEndDate}
                      onChange={(e) => {
                        setHoEndDate(e.target.value);
                        setHoDays(computedDays(hoStartDate, e.target.value));
                      }}
                      className="w-full bg-white border border-[#c5c5d3] rounded-lg px-3 py-2 outline-none font-bold text-slate-800 focus:border-[#00236f]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Số ngày thuê</label>
                    <input 
                      type="number"
                      value={hoDays}
                      readOnly
                      className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 outline-none font-mono font-bold text-slate-505"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Tổng tiền thuê</label>
                    <input 
                      type="number"
                      value={hoTotalPrice}
                      onChange={(e) => setHoTotalPrice(Number(e.target.value))}
                      className="w-full bg-white border border-slate-205 rounded-lg px-3 py-2 outline-none font-mono font-bold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-bold mb-1">Tổng tiền cọc</label>
                    <input 
                      type="number"
                      value={hoDeposit}
                      onChange={(e) => setHoDeposit(Number(e.target.value))}
                      className="w-full bg-white border border-slate-205 rounded-lg px-3 py-2 outline-none font-mono font-bold text-slate-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KHU VỰC DANH SÁCH MẪU THIẾT BỊ THUÊ */}
          <div className="bg-slate-50/70 p-5 border border-slate-200 rounded-xl space-y-3">
            <h4 className="text-[#00236f] font-black text-xs uppercase tracking-wider border-b pb-1.5 flex items-center justify-between">
              <span>📋 Khu vực danh sách mẫu thiết bị thuê</span>
              <span className="text-slate-400 font-semibold italic">Danh sách mẫu theo đơn đăng ký</span>
            </h4>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-50 border-b border-slate-200 text-[#0f172a] text-[12px] font-semibold">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap min-w-[180px]">Tên mẫu thiết bị</th>
                    <th className="px-4 py-3 text-center font-semibold whitespace-nowrap min-w-[100px]">Số lượng thuê</th>
                    <th className="px-4 py-3 text-right font-semibold whitespace-nowrap min-w-[110px]">Giá thuê/ngày</th>
                    <th className="px-4 py-3 text-right font-semibold whitespace-nowrap min-w-[110px]">Tiền cọc</th>
                    <th className="px-4 py-3 text-left font-semibold whitespace-nowrap min-w-[160px]">Bộ đi kèm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold">
                  {selectedOrder.equipments.map((eq, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 font-bold text-indigo-950">{eq.name}</td>
                      <td className="px-4 py-3 text-center text-slate-805">{eq.qty} chiếc</td>
                      <td className="px-4 py-3 text-right font-mono">{formatVND(eq.price)}</td>
                      <td className="px-4 py-3 text-right font-mono">{formatVND(eq.deposit)}</td>
                      <td className="px-4 py-3 text-slate-500 italic">Thân máy, sạc rải pin, cáp truyền dữ liệu, túi đựng chống hạt xước</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* KHU VỰC CHỌN TÀI SẢN CỤ THỂ */}
          <div className="bg-slate-50/70 p-6 border border-slate-200 rounded-2xl space-y-4" id="chon-tai-san-section">
            <div>
              <h4 className="text-[#00236f] font-black text-sm uppercase tracking-wider flex items-center gap-2">
                <span>⚙️ Chọn tài sản cụ thể</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">Chọn body chính và các thành phần đi kèm cho từng bộ thiết bị trong đơn hàng.</p>
            </div>

            <div className="space-y-4">
              {unitHandoverSelections.map((block, blockIdx) => {
                const totalCompCount = 1 + block.includedSelections.length;
                let selectedCompCount = 0;
                if (block.bodyAssetId) {
                  selectedCompCount += 1;
                  block.includedSelections.forEach(s => {
                    if (s.managementType === 'IDENTIFIED_ASSET' && s.assetId) selectedCompCount += 1;
                    if (s.managementType === 'QUANTITY' && s.quantity > 0) selectedCompCount += 1;
                  });
                }

                const cleanName = block.productName.includes('Sony') ? 'Sony A7 IV' : (block.productName.includes('Fuji') ? 'Fuji X-T5' : block.productName);
                const badgeState = validateUnitBlock(block, unitHandoverSelections);
                const isHighlighted = highlightedBlockIndex === blockIdx;

                return (
                  <div 
                    key={blockIdx} 
                    className={`bg-white border-2 rounded-xl overflow-hidden transition-all duration-200 ${
                      isHighlighted ? 'border-amber-400 ring-2 ring-amber-400/20' : 'border-slate-200'
                    }`}
                  >
                    {/* Header */}
                    <div 
                      className="p-4 flex flex-wrap items-center justify-between gap-3 bg-slate-50 border-b border-slate-200 cursor-pointer hover:bg-slate-100 select-none"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-indigo-900 font-bold">▼</span>
                        <strong className="text-sm font-black text-slate-900">{cleanName}</strong>
                        <span className="px-2 py-0.5 bg-slate-200 text-slate-805 font-mono font-bold rounded text-[10.5px]">#{block.unitIndex}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 font-bold">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-black tracking-wider ${
                          badgeState === 'Đã chọn đủ' ? 'bg-green-105 text-green-700 border border-green-200 bg-green-50' :
                          badgeState === 'Thiếu tài sản' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                          'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                        }`}>
                          {badgeState}
                        </span>
                        <span className="text-[11px] text-slate-500 font-bold">
                          ({selectedCompCount}/{totalCompCount} thành phần)
                        </span>
                      </div>
                    </div>

                    {/* Table Body Content directly opened as required */}
                    <div className="p-4 overflow-x-auto">
                      <table className="w-full text-xs text-slate-705 font-semibold border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-[#0f172a] text-[12px] font-semibold text-left border-b border-slate-200 whitespace-nowrap">
                            <th className="p-3 min-w-[160px] whitespace-nowrap font-semibold">Thành phần</th>
                            <th className="p-3 min-w-[110px] whitespace-nowrap font-semibold">Loại quản lý</th>
                            <th className="p-3 min-w-[100px] whitespace-nowrap font-semibold">Yêu cầu</th>
                            <th className="p-3 min-w-[320px] whitespace-nowrap font-semibold">Tài sản / Số lượng bàn giao</th>
                            <th className="p-3 min-w-[180px] whitespace-nowrap font-semibold">Tình trạng bàn giao</th>
                            <th className="p-3 min-w-[180px] whitespace-nowrap font-semibold">Ghi chú</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {/* Row: Body chính */}
                          <tr className="hover:bg-slate-50/50">
                            <td className="p-3 font-bold text-indigo-950 whitespace-nowrap">Body chính</td>
                            <td className="p-3 whitespace-nowrap">
                              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded font-bold text-[10px] border border-indigo-150">Serial</span>
                            </td>
                            <td className="p-3 whitespace-nowrap">
                              <span className="text-rose-500 font-extrabold">Bắt buộc</span>
                            </td>
                            <td className="p-3">
                              <select
                                value={block.bodyAssetId || ''}
                                onChange={(e) => {
                                  const updated = [...unitHandoverSelections];
                                  updated[blockIdx].bodyAssetId = e.target.value;
                                  setUnitHandoverSelections(updated);
                                }}
                                className="w-full bg-white border border-slate-350 rounded px-2.5 py-1.5 outline-none font-semibold text-slate-800 focus:border-indigo-600 text-xs"
                              >
                                <option value="">-- Chọn BODY thiết bị sê-ri --</option>
                                {loadingAssets ? (
                                  <option disabled>Đang tải tài sản từ DB...</option>
                                ) : (
                                  availableAssets
                                    .filter(a => a.mau_thiet_bi_id === block.productModelId)
                                    .map(a => {
                                      const isSelectedElsewhere = unitHandoverSelections.some((other, oIdx) => oIdx !== blockIdx && other.bodyAssetId === a.id);
                                      return (
                                        <option key={a.id} value={a.id} disabled={isSelectedElsewhere} className="whitespace-nowrap font-bold text-blue-900">
                                          [DB] {a.ma_tai_san} - S/N: {a.so_serial} - {a.ghi_chu_tinh_trang || 'Tốt'} {isSelectedElsewhere ? '[Đã chọn]' : ''}
                                        </option>
                                      );
                                    })
                                )}
                                {MOCK_BODIES_IN_STOCK.filter(b => (b.modelName === block.productName || b.modelName.includes(block.productName) || block.productName.includes(b.modelName)) && (b.status === "Sẵn sàng" || b.status === "S?n sng")).map(b => {
                                  // Kiểm tra xem serial này có được chọn ở bộ nào khác không
                                  const isSelectedElsewhere = unitHandoverSelections.some((other, oIdx) => oIdx !== blockIdx && other.bodyAssetId === b.assetCode);
                                  return (
                                    <option key={b.assetCode} value={b.assetCode} disabled={isSelectedElsewhere} className="whitespace-nowrap text-slate-500">
                                      [Mock] {b.assetCode} - S/N: {b.serial} - {b.condition} {isSelectedElsewhere ? '[Đã chọn ở dòng khác]' : ''}
                                    </option>
                                  );
                                })}
                              </select>
                            </td>
                            <td className="p-3">
                              <input 
                                type="text"
                                value={block.bodyStateBefore || ''}
                                onChange={(e) => {
                                  const updated = [...unitHandoverSelections];
                                  updated[blockIdx].bodyStateBefore = e.target.value;
                                  setUnitHandoverSelections(updated);
                                }}
                                className="w-full bg-white border border-slate-200 rounded px-2 py-1 outline-none text-slate-800 font-medium"
                              />
                            </td>
                            <td className="p-3">
                              <input 
                                type="text"
                                placeholder="Ghi chú thân máy..."
                                value={block.bodyNotes || ''}
                                onChange={(e) => {
                                  const updated = [...unitHandoverSelections];
                                  updated[blockIdx].bodyNotes = e.target.value;
                                  setUnitHandoverSelections(updated);
                                }}
                                className="w-full bg-white border border-slate-200 rounded px-2 py-1 outline-none text-slate-800 font-medium"
                              />
                            </td>
                          </tr>

                          {/* Rows for included items components list */}
                          {block.includedSelections.map((comp, compIdx) => {
                            return (
                              <tr key={compIdx} className="hover:bg-slate-50/50">
                                <td className="p-3 font-bold text-slate-800 whitespace-nowrap">{comp.includedItemName}</td>
                                <td className="p-3 whitespace-nowrap">
                                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] border ${
                                    comp.managementType === 'IDENTIFIED_ASSET' 
                                      ? 'bg-indigo-50 text-indigo-700 border-indigo-150' 
                                      : 'bg-amber-50 text-amber-700 border-amber-150'
                                  }`}>
                                    {comp.managementType === 'IDENTIFIED_ASSET' ? 'Serial' : 'Số lượng'}
                                  </span>
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                  {comp.required ? <span className="text-rose-500 font-extrabold">Bắt buộc</span> : <span className="text-slate-400">Tùy chọn</span>}
                                </td>
                                <td className="p-3">
                                  {comp.managementType === 'IDENTIFIED_ASSET' ? (
                                    <div>
                                      <select
                                        value={comp.assetId || ''}
                                        onChange={(e) => {
                                          const updated = [...unitHandoverSelections];
                                          updated[blockIdx].includedSelections[compIdx].assetId = e.target.value;
                                          setUnitHandoverSelections(updated);
                                        }}
                                        className="w-full bg-white border border-slate-350 rounded px-2.5 py-1.5 outline-none font-semibold text-slate-800 focus:border-indigo-600 text-xs"
                                      >
                                        <option value="">-- Chọn phụ kiện sê-ri --</option>
                                        {loadingAssets ? (
                                          <option disabled>Đang tải phụ kiện từ DB...</option>
                                        ) : (
                                          availableAssets
                                            .filter(a => {
                                              const name = (a.ten_tai_san || '').toLowerCase();
                                              const target = (comp.includedItemName || '').toLowerCase();
                                              return name.includes(target) || target.includes(name);
                                            })
                                            .map(a => {
                                              const isSelectedElsewhere = unitHandoverSelections.some((otherBlock, obIdx) => {
                                                return otherBlock.includedSelections.some((otherComp, ocIdx) => {
                                                  if (obIdx === blockIdx && ocIdx === compIdx) return false;
                                                  return otherComp.assetId === a.id && otherComp.assetId !== '';
                                                });
                                              });
                                              return (
                                                <option key={a.id} value={a.id} disabled={isSelectedElsewhere} className="whitespace-nowrap font-bold text-blue-900">
                                                  [DB] {a.ma_tai_san} - S/N: {a.so_serial} - {a.ghi_chu_tinh_trang || 'Tốt'} {isSelectedElsewhere ? '[Đã chọn]' : ''}
                                                </option>
                                              );
                                            })
                                        )}
                                        {MOCK_COMPONENTS_IN_STOCK.filter(c => (c.componentName === comp.includedItemName || c.componentName.includes(comp.includedItemName) || comp.includedItemName.includes(c.componentName) || c.modelName === comp.includedItemName) && (c.status === "Sẵn sàng" || c.status === "S?n sng")).map(c => {
                                          const isSelectedElsewhere = unitHandoverSelections.some((otherBlock, obIdx) => {
                                            return otherBlock.includedSelections.some((otherComp, ocIdx) => {
                                              if (obIdx === blockIdx && ocIdx === compIdx) return false;
                                              return otherComp.assetId === c.assetCode && otherComp.assetId !== '';
                                            });
                                          });
                                          return (
                                            <option key={c.assetCode} value={c.assetCode} disabled={isSelectedElsewhere} className="whitespace-nowrap text-slate-500">
                                              [Mock] {c.assetCode} - S/N: {c.serial} - {c.condition} {isSelectedElsewhere ? '[Đã chọn ở bộ khác]' : ''}
                                            </option>
                                          );
                                        })}
                                      </select>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                      <input 
                                        type="number"
                                        min="1"
                                        max={MOCK_QUANTITY_IN_STOCK[comp.includedItemName] || 10}
                                        value={comp.quantity || 1}
                                        onChange={(e) => {
                                          const updated = [...unitHandoverSelections];
                                          updated[blockIdx].includedSelections[compIdx].quantity = Number(e.target.value);
                                          setUnitHandoverSelections(updated);
                                        }}
                                        className="w-16 bg-white border border-slate-300 rounded px-2 py-1 outline-none font-bold text-center"
                                      />
                                      <span className="text-[10.5px] text-slate-500 font-bold whitespace-nowrap">
                                        Khả dụng: <strong className="text-indigo-700">{MOCK_QUANTITY_IN_STOCK[comp.includedItemName] || MOCK_QUANTITY_IN_STOCK['Mặc định'] || 10}</strong>
                                      </span>
                                    </div>
                                  )}
                                </td>
                                <td className="p-3">
                                  {comp.managementType === 'IDENTIFIED_ASSET' ? (
                                    <input 
                                      type="text"
                                      value={comp.stateBefore || ''}
                                      onChange={(e) => {
                                        const updated = [...unitHandoverSelections];
                                        updated[blockIdx].includedSelections[compIdx].stateBefore = e.target.value;
                                        setUnitHandoverSelections(updated);
                                      }}
                                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 outline-none text-slate-800 font-medium"
                                    />
                                  ) : (
                                    <span className="text-slate-400 pl-3">-</span>
                                  )}
                                </td>
                                <td className="p-3">
                                  <input 
                                    type="text"
                                    placeholder="Ghi chú..."
                                    value={comp.notes || ''}
                                    onChange={(e) => {
                                      const updated = [...unitHandoverSelections];
                                      updated[blockIdx].includedSelections[compIdx].notes = e.target.value;
                                      setUnitHandoverSelections(updated);
                                    }}
                                    className="w-full bg-white border border-slate-200 rounded px-2 py-1 outline-none text-slate-800 font-medium"
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

            {/* Bottom Button of choose asset section */}
            <div className="pt-4 border-t flex flex-wrap gap-4 justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200 select-none">
              <div>
                <span className="text-[11px] block text-slate-500 font-bold">Hãy tự thực hiện kiểm tra trạng thái xung đột trước khi lưu hồ sơ chính.</span>
              </div>
              <button
                type="button"
                onClick={handleCheckSelections}
                className="px-5 py-2.5 bg-[#00236f] hover:bg-[#fea619] hover:text-[#2a1700] text-white font-extrabold rounded-lg transition text-[11px] uppercase cursor-pointer"
              >
                Kiểm tra tài sản đã chọn
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* KHU VỰC UPLOAD ẢNH HOẶC FILE HỢP ĐỒNG GIẤY */}
            <div className="bg-slate-50/70 p-5 border border-slate-200 rounded-xl space-y-3">
              <h4 className="text-[#00236f] font-black text-xs uppercase tracking-wider border-b pb-1.5 flex items-center justify-between">
                <span>📝 Hợp đồng giấy trực tiếp</span>
                <span className="text-red-500 uppercase text-[9.5px] font-black">YÊU CẦU</span>
              </h4>
              
              <div className="bg-white border rounded-lg p-3 space-y-2 text-slate-600">
                <div className="grid grid-cols-3 gap-2 border-b pb-2 text-[10px] text-slate-400 uppercase">
                  <span>Tên file</span>
                  <span>Loại file</span>
                  <span>Kích thước</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono break-all py-1">
                  <span className="font-bold text-slate-800">{hoContractFile ? hoContractFile.name : "(Trống)"}</span>
                  <span className="text-slate-500">{hoContractFile ? hoContractFile.type : "-"}</span>
                  <span className="text-slate-500">{hoContractFile ? hoContractFile.size : "-"}</span>
                </div>
                
                {hoContractFile && (
                  <div className="mt-2 text-indigo-700 bg-indigo-50 border border-indigo-200 text-[10.5px] p-2 rounded flex items-center gap-1">
                    💾 File hợp đồng giấy đã sẵn sàng gửi đính kèm.
                  </div>
                )}
              </div>

              <div className="pt-2 text-center">
                <input
                  type="file"
                  ref={contractFileInputRef}
                  onChange={handleUploadContract}
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => contractFileInputRef.current?.click()}
                  disabled={uploadingContract}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-lg border border-slate-300 transition cursor-pointer flex items-center gap-1.5 mx-auto text-xs disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  {uploadingContract ? 'Đang tải lên...' : 'Nạp file hợp đồng giấy'}
                </button>
              </div>
            </div>

            {/* KHU VỰC UPLOAD ẢNH KHI BÀN GIAO */}
            <div className="bg-slate-50/70 p-5 border border-slate-200 rounded-xl space-y-3">
              <h4 className="text-[#00236f] font-black text-xs uppercase tracking-wider border-b pb-1.5 flex items-center justify-between">
                <span>📸 Ảnh thực tế bàn giao lúc xuất</span>
                <span className="text-red-500 uppercase text-[9.5px] font-black">YÊU CẦU</span>
              </h4>

              <div className="bg-white border rounded-lg p-3 space-y-2 text-slate-600">
                <div className="grid grid-cols-3 gap-2 border-b pb-2 text-[10px] text-slate-400 uppercase">
                  <span>Tên file</span>
                  <span>Loại file</span>
                  <span>Kích thước</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono break-all py-1">
                  <span className="font-bold text-slate-800">{hoHandoverFile ? hoHandoverFile.name : "(Trống)"}</span>
                  <span className="text-slate-500">{hoHandoverFile ? hoHandoverFile.type : "-"}</span>
                  <span className="text-slate-500">{hoHandoverFile ? hoHandoverFile.size : "-"}</span>
                </div>
                
                {hoHandoverFile && (
                  <div className="mt-2 text-emerald-800 bg-emerald-50 border border-emerald-200 text-[10.5px] p-2 rounded flex items-center gap-1">
                    🟢 Ảnh chứng cứ bàn giao đã sẵn sàng.
                  </div>
                )}
              </div>

              <div className="pt-2 text-center">
                <input
                  type="file"
                  ref={handoverFileInputRef}
                  onChange={handleUploadHandoverImages}
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => handoverFileInputRef.current?.click()}
                  disabled={uploadingHandover}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-lg border border-slate-300 transition cursor-pointer flex items-center gap-1.5 mx-auto text-xs disabled:opacity-50"
                >
                  <UploadCloud className="w-3.5 h-3.5" />
                  {uploadingHandover ? 'Đang tải lên...' : 'Nạp ảnh bàn giao thiết bị'}
                </button>
              </div>
            </div>
          </div>

          {/* KHU VỰC GHI CHÚ */}
          <div className="bg-slate-50/70 p-5 border border-slate-200 rounded-xl space-y-2.5">
            <label className="text-slate-700 block font-black uppercase text-xs">✍️ Khu vực ghi chú bàn giao</label>
            <textarea 
              value={hoNotes}
              onChange={(e) => setHoNotes(e.target.value)}
              placeholder="Nhập ghi chú chi tiết về trạng thái bàn giao..."
              rows={3}
              className="w-full bg-white border border-[#c5c5d3] rounded-xl p-3 outline-none font-semibold text-slate-800 focus:border-[#00236f]"
            />
          </div>

          {/* BUTTON CUỐI FORM */}
          <div className="flex justify-end gap-3 pt-6 border-t select-none font-bold">
            <button 
              type="button" 
              onClick={() => setActiveView('list')}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black rounded-xl transition"
            >
              Hủy
            </button>
            <button 
              type="submit"
              disabled={submittingHandover}
              className="px-7 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl transition shadow-xs uppercase flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {submittingHandover ? 'Đang xử lý...' : 'Xác nhận bàn giao'}
            </button>
          </div>
        </form>
      )}

    </div>
  );
}
