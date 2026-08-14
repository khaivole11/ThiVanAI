# Thi Vận AI

Thi Vận AI là ứng dụng thử nghiệm sáng tác thơ tiếng Việt. Dự án gồm:

- `frontend`: giao diện React + Vite để nhập câu thơ mở đầu, chọn thể thơ, xem kết quả và thử chế độ nghiên cứu.
- `backend`: API FastAPI cho pipeline RAG, gồm ingest dữ liệu thơ, Chroma vector search, BM25, sinh thơ bằng Ollama hoặc OpenAI, và lưu lịch sử bằng SQLite.
- `data`: corpus, index Chroma/BM25, manifest và SQLite database.

> Lưu ý: frontend hiện đang dùng dữ liệu mô phỏng trong `frontend/src/store.ts`, nên có thể chạy và demo giao diện mà không cần backend. Backend là API riêng để chạy pipeline RAG thật.

## Yêu cầu môi trường

- Node.js 20+ và npm.
- Python 3.11+.
- Một trong hai provider để sinh thơ:
  - Ollama, nếu dùng cấu hình mặc định `GENERATION_PROVIDER=ollama`.
  - OpenAI API key, nếu đổi sang `GENERATION_PROVIDER=openai`.
- Dữ liệu trong thư mục `data`. Nếu thiếu manifest hoặc index, cần chạy bước ingest ở phần bên dưới.

## Chạy nhanh frontend

Mở terminal tại thư mục gốc dự án:

```powershell
cd frontend
npm install
npm run dev
```

Sau đó mở:

```text
http://localhost:8443
```

Nếu cổng `8443` đang bận, đổi cổng trước khi chạy:

```powershell
$env:PORT=5173
npm run dev
```

Các trang chính:

- `/`: trang giới thiệu.
- `/sang-tac`: nhập câu thơ và tạo bài thơ mô phỏng.
- `/lich-su`: lịch sử bài thơ đã lưu trong localStorage của trình duyệt.
- `/nghien-cuu`: chế độ nghiên cứu RAG mô phỏng, có xuất JSON kết quả.
- `/cach-hoat-dong`: mô tả cách hệ thống hoạt động.
- `/ve-du-an`: thông tin dự án.

## Chạy backend API

Từ thư mục gốc dự án:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
python -m pip install -e .
Copy-Item .env.example .env
```

Nếu PowerShell chặn activate virtualenv, chạy:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\.venv\Scripts\Activate.ps1
```

Sau khi tạo `backend/.env`, nên chỉnh các đường dẫn dữ liệu để trỏ về thư mục `data` ở gốc dự án:

```env
DATA_DIR=../data
CORPUS_PATH=../data/raw/final_poems_dataset.csv
NORMALIZED_CORPUS_PATH=../data/processed/corpus_normalized.parquet
CORPUS_MANIFEST_PATH=../data/manifests/current.json
CHROMA_PATH=../data/indexes/chroma
BM25_INDEX_PATH=../data/indexes/bm25/bm25_index.pkl
SQLITE_URL=sqlite:///../data/app.db
```

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

Trong thư mục `backend`, sau khi đã activate virtualenv:

```powershell
python -m uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload
```

Kiểm tra server:

```text
http://127.0.0.1:8001/api/v1/health/live
http://127.0.0.1:8001/docs
```

## Ingest hoặc rebuild dữ liệu

Nếu backend báo thiếu manifest, thiếu Chroma/BM25 index, hoặc bạn thay corpus CSV, chạy:

```powershell
cd backend
.\.venv\Scripts\Activate.ps1
python scripts/ingest_corpus.py
```

Script này sẽ:

- đọc `data/raw/final_poems_dataset.csv`;
- tạo `data/processed/corpus_normalized.parquet`;
- build/upsert Chroma index;
- build BM25 index;
- ghi manifest vào `data/manifests/current.json`.

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
.\.venv\Scripts\Activate.ps1
python -m pytest tests
```

Nếu thiếu `pytest`, cài thêm trong virtualenv:

```powershell
python -m pip install pytest
```

## Lỗi thường gặp

- `Corpus manifest is missing`: kiểm tra lại các đường dẫn trong `backend/.env`, hoặc chạy `python scripts/ingest_corpus.py`.
- Server backend không start do `GENERATION_PROVIDER`: nếu dùng `openai` phải có `OPENAI_API_KEY`; nếu dùng `ollama` phải có `OLLAMA_BASE_URL` và `OLLAMA_MODEL`.
- API sinh thơ lỗi kết nối Ollama: mở Ollama và chạy `ollama pull qwen3:1.7b`.
- Frontend không chạy vì port bận: đặt `$env:PORT=5173` rồi chạy lại `npm run dev`.
- Frontend tạo thơ nhưng không gọi backend: đây là hành vi hiện tại, vì frontend đang dùng mock generation trong `frontend/src/store.ts`.
