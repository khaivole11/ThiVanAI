# Thi Vận AI

Thi Vận AI là ứng dụng thử nghiệm sáng tác thơ tiếng Việt. Dự án gồm:

- `frontend`: giao diện React + Vite để nhập câu thơ mở đầu, chọn thể thơ, xem kết quả và thử chế độ nghiên cứu.
- `backend`: API FastAPI cho pipeline RAG, gồm ingest dữ liệu thơ, Chroma vector search, BM25, sinh thơ bằng Ollama hoặc OpenAI, và lưu lịch sử bằng SQLite.
- `backend/data`: corpus, index Chroma/BM25, manifest và SQLite database hiện tại.

> Lưu ý: frontend hiện đã gọi backend qua `/api/v1`. Muốn chạy giao diện đầy đủ, hãy chạy backend trước rồi chạy frontend.

## Yêu cầu môi trường

- Node.js 20+ và npm.
- Python 3.11+.
- Một trong hai provider để sinh thơ:
  - Ollama, nếu dùng cấu hình mặc định `GENERATION_PROVIDER=ollama`.
  - OpenAI API key, nếu đổi sang `GENERATION_PROVIDER=openai`.
- Dữ liệu trong thư mục `backend/data`. Nếu thiếu manifest hoặc index, cần chạy bước ingest ở phần bên dưới.

Bạn có thể dùng Python `venv`, conda, pyenv hoặc môi trường Python khác. README mặc định dùng `venv` vì chạy được trên nhiều máy nhất; conda chỉ là tùy chọn.

## Chạy nhanh frontend

Chạy backend trước, sau đó mở terminal khác tại thư mục gốc dự án.

Windows PowerShell:

```powershell
cd frontend
Copy-Item .env.example .env
npm install
npm run dev
```

macOS/Linux:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

`frontend/.env` tối thiểu:

```env
FRONTEND_DEV_HOST=0.0.0.0
FRONTEND_DEV_PORT=8443
BACKEND_PROXY_TARGET=http://127.0.0.1:8001
VITE_API_BASE_URL=/api/v1
```

Sau đó mở:

```text
http://localhost:8443
```

Nếu cổng `8443` đang bận, đổi cổng trước khi chạy:

```powershell
$env:FRONTEND_DEV_PORT=5173
npm run dev
```

macOS/Linux:

```bash
FRONTEND_DEV_PORT=5173 npm run dev
```

Các trang chính:

- `/`: màn hình sáng tác chính.
- `/sang-tac`: nhập câu thơ và gọi backend để tạo bài thơ.
- `/ket-qua/:generationId`: kết quả một lần sinh thơ đã lưu trong localStorage.
- `/lich-su`: lịch sử bài thơ đã lưu trong localStorage của trình duyệt.
- `/nghien-cuu`: chế độ nghiên cứu retrieval/generation với thông số RAG thật từ backend.
- `/cach-hoat-dong`: mô tả cách hệ thống hoạt động.
- `/ve-du-an`: thông tin dự án.

## Chạy backend API

Các lệnh `cd backend` bên dưới giả định bạn đang mở terminal ở thư mục gốc repo. Nếu terminal đang ở `frontend`, chạy `cd ..\backend` trên Windows PowerShell hoặc `cd ../backend` trên macOS/Linux.

Tất cả lệnh backend phải chạy từ thư mục `backend`, trừ lệnh có `--app-dir backend`. Nếu terminal đang ở `frontend`, `uvicorn app.main:app` sẽ lỗi `ModuleNotFoundError: No module named 'app'`.

### Cách 1: Python venv khuyến nghị

Windows PowerShell:

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m pip install -e .
Copy-Item .env.example .env
```

Nếu PowerShell chặn activate virtualenv:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\.venv\Scripts\Activate.ps1
```

macOS/Linux:

```bash
cd backend
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m pip install -e .
cp .env.example .env
```

Sau khi activate, kiểm tra:

```powershell
python --version
python -c "import sys; print(sys.executable)"
```

Python phải là `3.11+`, và `sys.executable` phải nằm trong `.venv`.

### Cách 2: Conda tùy chọn

Nếu bạn dùng Anaconda/Miniconda, có thể đặt tên env tùy ý:

```powershell
cd backend
conda create -n thi-van-ai python=3.11
conda activate thi-van-ai
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m pip install -e .
Copy-Item .env.example .env
```

Nếu không muốn activate conda, thay `thi-van-ai` bằng tên env của bạn:

```powershell
conda run --no-capture-output -n thi-van-ai python -m pip install -r requirements.txt
conda run --no-capture-output -n thi-van-ai python -m pip install -e .
```

### File môi trường backend

Các đường dẫn mặc định trong `.env.example` đang đúng khi chạy từ thư mục `backend`:

```env
DATA_DIR=./data
CORPUS_PATH=./data/raw/final_poems_dataset.csv
NORMALIZED_CORPUS_PATH=./data/processed/corpus_normalized.parquet
CORPUS_MANIFEST_PATH=./data/manifests/current.json
CHROMA_PATH=./data/indexes/chroma
BM25_INDEX_PATH=./data/indexes/bm25/bm25_index.pkl
SQLITE_URL=sqlite:///./data/app.db
```

### Cấu hình Supabase để lưu feedback

Backend đã có endpoint:

```text
POST /api/v1/generations/{generationId}/feedback
```

Các bước bật Supabase:

1. Vào Supabase project, mở SQL Editor và chạy file:

```text
backend/supabase/feedback.sql
```

File này tạo bảng `public.generation_feedback` gồm `generation_id`, `rating`, `labels`, `comment`, `created_at`, bật RLS và không tạo policy public. Backend sẽ ghi dữ liệu bằng key server-side.

2. Lấy Project URL và Secret key trong Supabase Dashboard. Supabase hiện khuyến nghị dùng key mới dạng `sb_secret_...` cho backend; nếu project cũ chỉ có legacy `service_role` key thì vẫn có thể dùng biến fallback.

3. Thêm vào `backend/.env`:

```env
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
SUPABASE_FEEDBACK_TABLE=generation_feedback
SUPABASE_TIMEOUT_SECONDS=10
```

Nếu dùng legacy key:

```env
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<legacy-service-role-key>
SUPABASE_FEEDBACK_TABLE=generation_feedback
SUPABASE_TIMEOUT_SECONDS=10
```

Không đặt đồng thời `SUPABASE_SECRET_KEY` và `SUPABASE_SERVICE_ROLE_KEY`. Không đưa hai key này vào frontend hoặc commit vào git.

4. Restart backend. Khi chưa cấu hình Supabase, endpoint feedback sẽ trả lỗi `FEEDBACK_STORE_NOT_CONFIGURED` để tránh giả vờ lưu thành công.

### Dùng Ollama

Cấu hình mặc định trong `.env.example` dùng Ollama:

```env
GENERATION_PROVIDER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=qwen3:1.7b
```

Cài và chạy model:

```powershell
ollama pull qwen3:1.7b
```

Đảm bảo Ollama đang chạy trước khi gọi API sinh thơ.

### Dùng OpenAI

Đổi các biến sau trong `backend/.env`:

```env
GENERATION_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
```

Không commit file `.env` vì có thể chứa secret.

### Khởi động server

Từ thư mục `backend`, sau khi đã activate `venv` hoặc conda env:

```powershell
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

Log đúng sẽ có dạng:

```text
Will watch for changes in these directories: ['...\\backend']
```

Nếu bạn đang đứng ở thư mục gốc repo, có thể chạy:

```powershell
python -m uvicorn --app-dir backend app.main:app --host 127.0.0.1 --port 8001 --reload
```

Nếu dùng conda mà không activate env, thay `<env-name>` bằng tên env của bạn:

```powershell
conda run --no-capture-output -n <env-name> python -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

Lệnh `conda run` này cũng phải chạy từ thư mục `backend`. Nếu chạy từ `frontend`, backend sẽ không import được module `app`.

Kiểm tra server:

```text
http://127.0.0.1:8001/api/v1/health/live
http://127.0.0.1:8001/docs
```

## Ingest hoặc rebuild dữ liệu

Nếu backend báo thiếu manifest, thiếu Chroma/BM25 index, hoặc bạn thay corpus CSV, chạy:

```powershell
cd backend
python scripts/ingest_corpus.py
```

Script này sẽ:

- đọc `backend/data/raw/final_poems_dataset.csv`;
- tạo `backend/data/processed/corpus_normalized.parquet`;
- build/upsert Chroma index;
- build BM25 index;
- ghi manifest vào `backend/data/manifests/current.json`.

Lần đầu chạy embedding model có thể mất nhiều thời gian vì cần tải model `sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2`.

## Ví dụ gọi API

Tìm bài thơ liên quan:

```powershell
Invoke-RestMethod `
  -Uri "http://127.0.0.1:8001/api/v1/retrieval/search" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"firstVerse":"Trăng nghiêng qua mái hiên nhà","genre":"Lục bát","topK":5}'
```

Sinh bài thơ:

```powershell
Invoke-RestMethod `
  -Uri "http://127.0.0.1:8001/api/v1/generations" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"firstVerse":"Trăng nghiêng qua mái hiên nhà","poetryForm":"Lục bát","authorStyle":"Nguyễn Du","periodStyle":"Trung đại","topK":5}'
```

Lấy lịch sử sinh thơ:

```powershell
Invoke-RestMethod "http://127.0.0.1:8001/api/v1/generations?page=1&page_size=20"
```

Gửi feedback cho một bài thơ đã sinh:

```powershell
Invoke-RestMethod `
  -Uri "http://127.0.0.1:8001/api/v1/generations/<generation-id>/feedback" `
  -Method Post `
  -ContentType "application/json" `
  -Body '{"rating":5,"labels":["relevant","structured"],"comment":"Bài thơ sát yêu cầu và mạch cảm xúc tốt."}'
```

Lấy metadata:

```powershell
Invoke-RestMethod "http://127.0.0.1:8001/api/v1/metadata/poetry-forms"
Invoke-RestMethod "http://127.0.0.1:8001/api/v1/metadata/periods"
```

## Kiểm tra và build

Frontend:

```powershell
cd frontend
npm run build
```

Backend tests:

```powershell
cd backend
python -m pytest tests
```

Nếu thiếu `pytest`, cài thêm trong môi trường Python đang dùng:

```powershell
python -m pip install pytest
```

## Lỗi thường gặp

### `ModuleNotFoundError: No module named 'app'`

Bạn đang chạy backend command sai thư mục, thường là đang đứng trong `frontend`.

Nếu log có dòng như sau thì chắc chắn đang sai thư mục:

```text
Will watch for changes in these directories: ['...\\frontend']
```

Cách sửa:

```powershell
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

Nếu terminal hiện đang ở `frontend`:

```powershell
cd ..\backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

Nếu đang đứng ở thư mục gốc repo và không muốn `cd backend`:

```powershell
python -m uvicorn --app-dir backend app.main:app --host 127.0.0.1 --port 8001 --reload
```

### `ImportError: cannot import name 'Self' from 'typing'`

Backend đang chạy bằng Python 3.10. Dự án cần Python 3.11+.

Kiểm tra:

```powershell
python --version
where.exe python
```

Tạo lại môi trường với Python 3.11+ rồi cài dependencies theo phần `Chạy backend API`.

Nếu dùng conda và `conda activate` không đổi đúng Python, khởi tạo lại shell:

```powershell
conda init powershell
```

Đóng toàn bộ PowerShell, mở lại terminal mới rồi thử lại.

### `conda run ... uvicorn` nhìn như không chạy

Thêm `--no-capture-output` và chạy từ thư mục `backend`:

```powershell
cd backend
conda run --no-capture-output -n <env-name> python -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

Nếu không thêm flag này, `conda run` có thể không in log Uvicorn ngay.

### Kẹt ở `Waiting for application startup`

Backend load Chroma và embedding model trong lifespan startup. Lần đầu có thể mất vài phút vì `sentence-transformers` kiểm tra hoặc tải file từ HuggingFace.

Nếu log có dạng request tới `https://huggingface.co/...` bị chặn, kiểm tra mạng, firewall hoặc proxy. Nếu model đã được cache local và chỉ muốn chạy offline:

```powershell
$env:HF_HUB_OFFLINE="1"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

Nếu model chưa có trong cache, bỏ `HF_HUB_OFFLINE` và cho phép tải model một lần:

```powershell
python -c "from sentence_transformers import SentenceTransformer; SentenceTransformer('sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2')"
```

### `Corpus manifest is missing`

Kiểm tra `backend/.env` đang trỏ tới `./data/...` khi chạy từ thư mục `backend`, hoặc chạy lại ingest:

```powershell
cd backend
python scripts/ingest_corpus.py
```

### Server backend không start do `GENERATION_PROVIDER`

Nếu dùng `openai` phải có `OPENAI_API_KEY` và `OPENAI_MODEL`. Nếu dùng `ollama` phải có `OLLAMA_BASE_URL` và `OLLAMA_MODEL`.

### API sinh thơ lỗi kết nối Ollama

Mở Ollama và chạy:

```powershell
ollama pull qwen3:1.7b
```

### Frontend báo `BACKEND_PROXY_TARGET is required`

Tạo `frontend/.env` từ `.env.example`:

```powershell
cd frontend
Copy-Item .env.example .env
```

### Frontend không chạy vì port bận

Đặt port khác rồi chạy lại:

```powershell
$env:FRONTEND_DEV_PORT=5173
npm run dev
```

macOS/Linux:

```bash
FRONTEND_DEV_PORT=5173 npm run dev
```
