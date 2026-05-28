# Bước 1: Build Image (Tầng biên dịch)
FROM golang:1.22-alpine AS builder
WORKDIR /app

# Tải dependencies trước để tận dụng cache của Docker
COPY go.mod go.sum ./
RUN go mod download

# Copy toàn bộ mã nguồn
COPY . .

# Biên dịch ra file thực thi tĩnh. CGO_ENABLED=0 bắt buộc để chạy độc lập trên Alpine
RUN CGO_ENABLED=0 GOOS=linux go build -o /namviet-api ./cmd/api/main.go

# Bước 2: Run Image (Tầng vận hành siêu nhẹ)
FROM alpine:latest

# Cài đặt chứng chỉ SSL gốc để Golang có thể gọi ra ngoại mạng (Cloudinary/Supabase)
RUN apk --no-cache add ca-certificates

WORKDIR /

# Chỉ bốc file đã biên dịch từ bước 1 sang
COPY --from=builder /namviet-api /namviet-api

# Đã chặn copy file cứng firebase-adminsdk.json vì lý do bảo mật. 
# Sẽ sử dụng Secret Manager hoặc Biến Môi Trường thay thế.
# COPY --from=builder /app/internal/services/firebase-adminsdk.json /internal/services/firebase-adminsdk.json

# Khai báo cổng nội bộ (Cloud Run mặc định đẩy traffic vào cổng 8080)
EXPOSE 8080

CMD ["/namviet-api"]
