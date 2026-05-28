'use client';

import React, { useState } from 'react';
import { X, Send, Bot, CheckCircle2, Sparkles, Paperclip } from 'lucide-react';

interface ChatbotSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatbotSheet({ isOpen, onClose }: ChatbotSheetProps) {
  const [input, setInput] = useState('');
  
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] transition-opacity animate-in fade-in" 
        onClick={onClose}
      />
      
      {/* Sheet Content */}
      <div className={`fixed z-[110] bg-slate-50 flex flex-col shadow-2xl overflow-hidden
        /* Mobile: Trượt từ dưới lên, bo tròn góc trên */
        bottom-0 left-0 right-0 h-[85vh] rounded-t-[32px] animate-in slide-in-from-bottom-full duration-200
        /* Desktop: Trượt từ phải sang, full height */
        md:top-0 md:bottom-0 md:right-0 md:left-auto md:w-[620px] md:h-full md:rounded-none md:slide-in-from-right-full
      `}>
        
        {/* Header */}
        <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
             <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-tr from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-white shadow-md">
                   <Bot size={24} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                   <CheckCircle2 size={10} className="text-white" />
                </div>
             </div>
             <div>
                <h3 className="font-black text-slate-800 text-lg leading-tight flex items-center gap-1">
                   NamViet AI <Sparkles size={14} className="text-amber-500" />
                </h3>
                <p className="text-xs font-medium text-emerald-600 bg-emerald-50 w-max px-2 py-0.5 rounded-full mt-1">Trợ lý ảo thông minh</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-slate-50 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center transition-colors active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
           {/* Bot Message */}
           <div className="flex gap-3 max-w-[90%]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 shrink-0 flex items-center justify-center text-white shadow-sm mt-1">
                 <Bot size={16} />
              </div>
              <div>
                 <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 text-[15px] text-slate-700 leading-relaxed">
                    Chào anh <strong>Lê Việt Hùng</strong>, em là trợ lý ảo của Nam Việt. Em có thể hỗ trợ anh:
                    <ul className="mt-2 space-y-1 text-sm font-medium">
                       <li className="flex items-center gap-2 text-slate-600"><div className="w-1 h-1 bg-orange-500 rounded-full"></div> Tạo đơn hàng tự động</li>
                       <li className="flex items-center gap-2 text-slate-600"><div className="w-1 h-1 bg-orange-500 rounded-full"></div> Tra cứu chương trình KM</li>
                       <li className="flex items-center gap-2 text-slate-600"><div className="w-1 h-1 bg-orange-500 rounded-full"></div> Kiểm tra công nợ</li>
                    </ul>
                 </div>
                 <div className="text-[10px] font-medium text-slate-400 mt-1.5 ml-1">Vừa xong</div>
              </div>
           </div>

           {/* User Message */}
           <div className="flex gap-3 max-w-[90%] ml-auto justify-end">
              <div>
                 <div className="bg-slate-900 text-white p-4 rounded-2xl rounded-tr-none shadow-sm text-[15px] leading-relaxed">
                    Gợi ý cho tôi các loại thuốc Kháng sinh đang giảm giá hôm nay nhé.
                 </div>
                 <div className="text-[10px] font-medium text-slate-400 mt-1.5 mr-1 text-right">1 phút trước</div>
              </div>
           </div>

           {/* Bot Message - Product Suggestion */}
           <div className="flex gap-3 max-w-[95%]">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-red-500 shrink-0 flex items-center justify-center text-white shadow-sm mt-1">
                 <Bot size={16} />
              </div>
              <div className="flex-1">
                 <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 text-[15px] text-slate-700 leading-relaxed mb-3">
                    Dạ, hệ thống đang có **3 mặt hàng Kháng sinh** giảm sâu nhất hôm nay dành riêng cho Nhà thuốc An Khang:
                 </div>
                 
                 {/* Product Card inside chat */}
                 <div className="bg-white border border-slate-200 rounded-xl p-3 flex gap-3 shadow-sm hover:border-orange-300 transition-colors cursor-pointer">
                    <img src="https://cdn.thegioididong.com/Products/Images/10026/230085/amoxicillin-500mg-brawn-h-100v-2-1.jpg" alt="Thuốc" className="w-16 h-16 rounded-lg object-cover" />
                    <div>
                       <h4 className="text-sm font-bold text-slate-800 line-clamp-1">Amoxicillin 500mg</h4>
                       <div className="text-xs text-slate-500 mb-1">Hộp 10 vỉ x 10 viên</div>
                       <div className="text-orange-600 font-black text-sm">45.000đ <span className="text-xs text-slate-400 line-through font-normal ml-1">55.000đ</span></div>
                    </div>
                 </div>
                 <div className="text-[10px] font-medium text-slate-400 mt-1.5 ml-1">Vừa xong</div>
              </div>
           </div>
        </div>

        {/* Suggestion Chips */}
        <div className="px-5 pb-3 pt-2 flex gap-2 overflow-x-auto no-scrollbar shrink-0 bg-slate-50">
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-orange-600 whitespace-nowrap shadow-sm hover:border-orange-300 active:scale-95 transition-all">Lên đơn Kháng sinh này</button>
           <button className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600 whitespace-nowrap shadow-sm hover:border-slate-300 active:scale-95 transition-all">Tra cứu công nợ</button>
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 border-t border-slate-100 shrink-0">
           <div className="relative flex items-end bg-slate-50 border border-slate-200 rounded-3xl p-1.5 shadow-inner">
              <button className="w-10 h-10 shrink-0 text-slate-400 hover:text-slate-600 flex items-center justify-center">
                 <Paperclip size={20} />
              </button>
              <textarea 
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 placeholder="Hỏi AI bất cứ điều gì..."
                 className="flex-1 max-h-32 bg-transparent text-slate-800 text-[15px] font-medium outline-none resize-none py-2.5 px-2 no-scrollbar"
                 rows={1}
              />
              <button 
                 className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all ${input.trim() ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' : 'bg-slate-200 text-slate-400'}`}
              >
                 <Send size={18} className={input.trim() ? 'ml-0.5' : ''} />
              </button>
           </div>
        </div>

      </div>
    </>
  );
}
