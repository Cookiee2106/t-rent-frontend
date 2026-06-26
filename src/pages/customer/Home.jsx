import React, { useState, forwardRef } from 'react';
import { motion } from 'motion/react';
import { Camera, Layers, Video, Mic, Lightbulb, Sliders, Eye, Search, FileText, CreditCard, RefreshCw, Star, Info, Check } from 'lucide-react';
import { CATEGORIES } from '../../data';
import deviceApi from '../../api/deviceApi';

const Home = forwardRef(({
  setActivePage,
  setSelectedCategory,
  onOpenEquipmentDetail
}, ref) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const [popularEquipments, setPopularEquipments] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchPopular = async () => {
      try {
        setLoading(true);
        const res = await deviceApi.getDeviceModels({ limit: 4 });
        setPopularEquipments(res.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch popular equipments', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  // Map category icons to lucide icons
  const renderCategoryIcon = (iconName) => {
    switch (iconName) {
      case 'photo_camera':
        return <Camera className="w-6 h-6" />;
      case 'camera_rear':
        return <Star className="w-6 h-6" />; // representing high-quality lens
      case 'videocam':
        return <Video className="w-6 h-6" />;
      case 'gimbal':
        return (
          <img 
            alt="Gimbal icon" 
            className="w-6 h-6 object-contain group-hover:brightness-0 group-hover:invert transition-all"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDjgi87znhS5Qczrcc_GwKmLqRBld_M2FjvSyLU88LjVqzPR0mYtSmow8R7UDr_eXeuvVdTXA2elq7P9eYHsgCmNHmxAtEP7hWNcL47IF7_KRE94sCQ9-dcUtcj6mG_4cH0MpTClkzRBENA5SsElGZbtJZuq1lvClKpD5wkpZkeIwdxnke4SqJGMSV7Is2vpE8yWvWPZgpSpcMt7sraN9kcbqJQz5svh6SMWVSaIv6o_ZIWVDkZRlDsofXXccPDwkkRzAG9oWD-KUw"
          />
        );
      case 'mic':
        return <Mic className="w-6 h-6 text-white group-hover:text-amber-500" />;
      case 'lightbulb':
        return <Lightbulb className="w-6 h-6" />;
      case 'settings_input_component':
        return <Sliders className="w-6 h-6" />;
      default:
        return <Layers className="w-6 h-6" />;
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setActivePage('equipments');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setTimeout(() => {
        setNewsletterEmail('');
        setNewsletterSubscribed(false);
      }, 5000);
    }
  };

  return (
    <div className="w-full bg-[#f8f9fa] text-[#191c1d]">
      
      {/* Hero Banner Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <img 
          alt="Hero background" 
          className="absolute inset-0 w-full h-full object-cover select-none"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCHLcs874RsPixOhaJs8myWIbEihgIv617QKS6l9wwYrXNAuujxHXu_Ep7-MJDnhAoaWqOSAz5K_9Eg1YKreA-dYD-fANvHA-r_JiZARDaYp1lLIrxZuZ9u4Q-GwssniFUO4mTthBLaaIDB4axXxIUU7LgUYmNipn3T1zxhzj3-wVjOTQSx0q3lGrL5exe35bmYI4btDtkDkP4YH-JXLaPKyVa8HFMeWUWlhf3fJeJSko7QC6qMOpY9V8zOJkiL0oJbDijXb2LYb04" 
        />
        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#00113a]/90 via-[#00113a]/65 to-transparent"></div>
        
        <div className="relative w-full max-w-7xl mx-auto px-4 md:px-8 z-10">
          <div className="max-w-2xl text-white">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight select-none tracking-tight"
            >
              Thuê máy ảnh và thiết bị quay chụp dễ dàng cùng T-Rent
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl mb-10 opacity-90 font-light select-none"
            >
              Chọn thiết bị, đặt cọc giữ chỗ, nhận thiết bị tại cửa hàng và theo dõi đơn thuê trực tuyến.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <button 
                onClick={() => handleCategorySelect('all')}
                className="px-8 py-4 bg-[#fea619] hover:bg-[#fea619]/90 text-[#2a1700] font-bold text-sm md:text-base rounded duration-200 active:scale-95 shadow-md"
              >
                Xem thiết bị
              </button>
              <button 
                onClick={() => {
                  const scrollSection = document.getElementById('rental-process');
                  if (scrollSection) {
                    scrollSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-8 py-4 border-2 border-white text-white font-bold text-sm md:text-base rounded hover:bg-white/10 duration-200 active:scale-95"
              >
                Quy trình thuê
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Grid Section */}
      <section className="py-16 bg-[#f8f9fa] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {CATEGORIES.filter(cat => cat.id !== 'all').map((category) => (
              <motion.div
                whileHover={{ y: -4 }}
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="group flex flex-col items-center p-6 bg-white border border-[#c5c5d3] rounded-lg hover:border-[#00236f] transition-all cursor-pointer shadow-sm text-center"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-[#dce1ff] text-[#00236f] rounded-lg mb-4 group-hover:bg-[#00236f] group-hover:text-white transition-all duration-300">
                  {renderCategoryIcon(category.icon)}
                </div>
                <span className="font-bold text-xs uppercase tracking-wider text-[#00236f] group-hover:text-[#fea619] transition-colors">
                  {category.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Equipment List Section */}
      <section className="py-16 bg-[#f3f4f5]">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-[#00236f] mb-3 select-none">Thiết bị phổ biến</h2>
              <p className="text-sm md:text-base text-[#444651] select-none">Top các thiết bị được thuê nhiều nhất trong tuần.</p>
            </div>
            <button 
              onClick={() => handleCategorySelect('all')}
              className="text-[#00236f] font-bold text-sm md:text-base hover:underline self-start sm:self-auto flex items-center gap-1"
            >
              Tất cả thiết bị →
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <RefreshCw className="w-8 h-8 text-[#00236f] animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularEquipments.map((eq) => (
                <motion.div 
                  whileHover={{ y: -8 }}
                  key={eq.id}
                  className="bg-white border border-[#c5c5d3] rounded-xl overflow-hidden group hover:shadow-lg transition-all duration-300 flex flex-col h-full"
                >
                  {/* Product Image Stage */}
                  <div className="relative aspect-square overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img 
                      alt={eq.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      src={eq.imageUrl || eq.image} 
                    />
                    {eq.status === 'ACTIVE' && (
                      <span className="absolute top-3 left-3 bg-green-100 border border-green-300 text-green-800 text-[10px] font-extrabold px-2 py-1 rounded uppercase tracking-wider">
                        Còn sẵn
                      </span>
                    )}
                    <div className="absolute bottom-3 right-3 bg-[#00236f] text-white px-3 py-1.5 rounded font-extrabold text-xs">
                      {Number(eq.dailyPrice || eq.pricePerDay || 0).toLocaleString('vi-VN')}đ / ngày
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-grow">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#444651] mb-1">
                      {eq.brand?.name || eq.brand}
                    </span>
                    <h3 className="text-lg font-bold text-[#00236f] mb-2 line-clamp-1 group-hover:text-[#fea619] transition-colors">
                      {eq.name}
                    </h3>
                    <p className="text-xs text-[#444651] mb-5">
                      Giá cọc: <span className="text-[#00236f] font-bold">{Number(eq.depositAmount || eq.deposit || 0).toLocaleString('vi-VN')}đ</span>
                    </p>
                    
                    <button 
                      onClick={() => onOpenEquipmentDetail(eq)}
                      className="mt-auto w-full py-3 border border-[#00236f] text-[#00236f] font-bold rounded-lg hover:bg-[#00236f] hover:text-white transition-all duration-300 text-sm flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      Xem chi tiết
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4-Step Rental Process Section */}
      <section id="rental-process" ref={ref} className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#00236f] mb-4">Quy trình thuê tại T-Rent</h2>
            <p className="text-base text-[#444651] max-w-2xl mx-auto font-light">
              Chỉ với 4 bước đơn giản, bạn đã có thể sở hữu thiết bị mơ ước cho dự án của mình với thủ tục nhanh gọn hàng đầu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            {/* Connector Line for Desktop */}
            <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-[#c5c5d3] z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center px-4">
              <div className="w-20 h-20 rounded-full bg-[#00236f] hover:bg-[#fea619] hover:rotate-12 flex items-center justify-center text-white mb-6 border-8 border-white transition-all duration-300 shadow-md">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#00236f] mb-2">1. Chọn thiết bị</h3>
              <p className="text-sm text-[#444651] leading-relaxed">
                Tìm kiếm và lựa chọn các thiết bị ưng ý từ danh mục phong phú của chúng tôi.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center px-4">
              <div className="w-20 h-20 rounded-full bg-[#00236f] hover:bg-[#fea619] hover:rotate-12 flex items-center justify-center text-white mb-6 border-8 border-white transition-all duration-300 shadow-md">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#00236f] mb-2">2. Tạo đơn thuê</h3>
              <p className="text-sm text-[#444651] leading-relaxed">
                Chọn khoảng thời gian thuê, điền thông tin người nhận và cấu hình các yêu cầu đặc biệt.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center px-4">
              <div className="w-20 h-20 rounded-full bg-[#00236f] hover:bg-[#fea619] hover:rotate-12 flex items-center justify-center text-white mb-6 border-8 border-white transition-all duration-300 shadow-md">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#00236f] mb-2">3. Thanh toán cọc</h3>
              <p className="text-sm text-[#444651] leading-relaxed">
                Hoàn tất thủ tục đặt cọc trực tuyến cực kỳ bảo mật hoặc gửi thông tin xác nhận nhanh chóng.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative z-10 flex flex-col items-center text-center px-4">
              <div className="w-20 h-20 rounded-full bg-[#00236f] hover:bg-[#fea619] hover:rotate-12 flex items-center justify-center text-white mb-6 border-8 border-white transition-all duration-300 shadow-md">
                <RefreshCw className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#00236f] mb-2">4. Nhận và trả</h3>
              <p className="text-sm text-[#444651] leading-relaxed">
                Nhận thiết bị trực tiếp tại showroom hoặc giao tận nơi, sản xuất dự án, và hoàn trả đúng hẹn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter signup & CTA */}
      <section className="py-16 bg-[#1e3a8a] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Sẵn sàng bắt đầu dự án?</h2>
            <p className="text-sm md:text-base text-[#90a8ff] opacity-90">
              Đăng ký để nhận thông báo ưu đãi lên tới 30% và cập nhật các dòng thiết bị mới nhất hàng tháng.
            </p>
          </div>
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3 min-w-[320px] sm:min-w-[450px]">
            {newsletterSubscribed ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full px-4 py-3 bg-green-500/10 border border-green-500/30 text-green-300 font-bold rounded flex items-center gap-2 justify-center"
              >
                <Check className="w-5 h-5 text-green-400" />
                Cảm ơn bạn đã đăng ký nhận bản tin T-Rent!
              </motion.div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 w-full">
                <input 
                  type="email" 
                  required
                  placeholder="Email của bạn"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="px-4 py-3 bg-white text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#fea619] rounded w-full border-none transition-all placeholder-gray-400"
                />
                <button 
                  type="submit"
                  className="px-6 py-3 bg-[#fea619] hover:bg-[#fea619]/90 text-[#2a1700] font-bold rounded duration-200 active:scale-95 whitespace-nowrap text-center"
                >
                  Đăng ký
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

    </div>
  );
});

export default Home;
