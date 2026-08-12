import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#252932] text-[#c0c4cc] mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#3f4a6b] flex items-center justify-center flex-shrink-0">
                <span className="text-[#d6b98c] text-sm font-serif">詩</span>
              </div>
              <span className="font-bold text-white text-base">Thi Vận AI</span>
            </div>
            <p className="text-sm text-[#969ca7] leading-relaxed max-w-xs">
              Ứng dụng sinh thơ tiếng Việt sử dụng Retrieval-Augmented
              Generation, kết hợp kho thi ca phong phú với mô hình ngôn ngữ hiện
              đại.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Khám phá</h3>
            <nav aria-label="Liên kết footer" className="flex flex-col gap-2">
              <Link
                to="/cach-hoat-dong"
                className="text-sm text-[#969ca7] hover:text-[#f4f2ed] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] rounded"
              >
                Cách hoạt động
              </Link>
              <Link
                to="/ve-du-an"
                className="text-sm text-[#969ca7] hover:text-[#f4f2ed] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] rounded"
              >
                Về dự án
              </Link>
              <Link
                to="/sang-tac"
                className="text-sm text-[#969ca7] hover:text-[#f4f2ed] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] rounded"
              >
                Bắt đầu sáng tác
              </Link>
              <Link
                to="/nghien-cuu"
                className="text-sm text-[#969ca7] hover:text-[#f4f2ed] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#596789] rounded"
              >
                Chế độ nghiên cứu
              </Link>
            </nav>
          </div>

          {/* Academic info */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Về dự án</h3>
            <p className="text-sm text-[#969ca7] leading-relaxed">
              Dự án nghiên cứu học thuật về sinh thơ tiếng Việt bằng RAG.
            </p>
            <p className="text-sm text-[#969ca7] mt-2 leading-relaxed">
              Dữ liệu từ: Facebook, Tkaraoke, Thi Viện, Lục Bát.
            </p>
          </div>
        </div>

        <div className="border-t border-[#30343d] pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#666c76]">
            © 2025 Thi Vận AI — Dành cho mục đích học thuật
          </p>
          <p className="text-xs text-[#666c76]">
            Thơ được tạo bởi AI, không đại diện cho tác giả thực
          </p>
        </div>
      </div>
    </footer>
  );
}
