package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	_ "github.com/jackc/pgx/v5/stdlib" // Bắt buộc phải có dấu "_" để tải driver ngầm
	"github.com/joho/godotenv"
	"github.com/namviet/backend-core/internal/handlers"
	"github.com/namviet/backend-core/internal/repositories"
	"github.com/namviet/backend-core/internal/services"
)

func main() {
	// 1. TẢI CẤU HÌNH TỪ FILE .env
	err := godotenv.Load() // Nếu để trống, nó sẽ tự tìm file .env ở thư mục Sếp đang đứng (Terminal)
	if err != nil {
		// Thêm log chi tiết để biết nó đang tìm ở đâu
		wd, _ := os.Getwd()
		log.Printf("⚠️ Cảnh báo: Không tìm thấy file .env tại %s, sẽ dùng biến môi trường OS", wd)
	}

	// 2. LẤY CHÌA KHÓA KẾT NỐI
	database_url := os.Getenv("DATABASE_URL")
	if database_url == "" {
		log.Fatal("❌ Lỗi: Biến DATABASE_URL đang trống")
	}

	// [FIX] Tự động vô hiệu hóa Prepared Statements để tương thích với cổng Pooler 6543 của Supabase
	if !strings.Contains(database_url, "default_query_exec_mode") {
		if strings.Contains(database_url, "?") {
			database_url += "&default_query_exec_mode=exec&statement_cache_capacity=0"
		} else {
			database_url += "?default_query_exec_mode=exec&statement_cache_capacity=0"
		}
	}

	// 3. KHỞI TẠO ĐƯỜNG ỐNG KẾT NỐI (CONNECTION POOL)
	db_connection, err := sql.Open("pgx", database_url)
	if err != nil {
		log.Fatal("❌ Lỗi khởi tạo đường ống: ", err)
	}
	
	// Dặn Golang: "Khi nào chương trình tắt, nhớ đóng cửa (Close) Database lại để không tốn RAM"
	defer db_connection.Close()

	// 4. GÕ CỬA SUPABASE (PING)
	fmt.Println("⏳ Đang Ping tới lõi Supabase Nam Việt...")
	err = db_connection.Ping()
	if err != nil {
		log.Fatal("❌ Báo động: Đứt cáp hoặc sai mật khẩu Supabase! Chi tiết: ", err)
	}

	// 5. BÁO CÁO THÀNH CÔNG
	fmt.Println("✅ CHÚC MỪNG SẾP! Backend Golang đã kết nối thành công tới Database Supabase qua cổng Pooler 6543!")

	// Test Cloudinary
    if err := services.TestCloudinary(); err != nil {
        log.Println("❌ Lỗi Cloudinary:", err)
    }

    // Test Firebase
    if err := services.TestFirebase(); err != nil {
        log.Println("❌ Lỗi Firebase:", err)
    }

	// 6. KHỞI TẠO REPOSITORY VÀ HANDLER
	companyRepo := repositories.NewCompanyRepository(db_connection)
	companyHandler := handlers.NewCompanyHandler(companyRepo)

	warehouseRepo := repositories.NewWarehouseRepository(db_connection)
	warehouseHandler := handlers.NewWarehouseHandler(warehouseRepo)

	// 7. CẤU HÌNH ROUTER (HTTP SERVER)
	mux := http.NewServeMux()

	// API Công ty
	mux.HandleFunc("GET /api/v1/companies", companyHandler.GetAll)
	mux.HandleFunc("POST /api/v1/companies", companyHandler.Create)
	mux.HandleFunc("PUT /api/v1/companies/{id}", companyHandler.Update)
	mux.HandleFunc("DELETE /api/v1/companies/{id}", companyHandler.Delete)

	// API Chi nhánh (Warehouses)
	mux.HandleFunc("GET /api/v1/warehouses", warehouseHandler.GetAll)
	mux.HandleFunc("GET /api/v1/warehouses/{id}", warehouseHandler.GetByID)
	mux.HandleFunc("POST /api/v1/warehouses", warehouseHandler.Create)
	mux.HandleFunc("PUT /api/v1/warehouses/{id}", warehouseHandler.Update)
	mux.HandleFunc("DELETE /api/v1/warehouses/{id}", warehouseHandler.Delete)

	// API Upload
	mux.HandleFunc("POST /api/v1/upload", handlers.UploadImage)

	// CORS Middleware Wrapper
	corsHandler := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			
			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}
			
			next.ServeHTTP(w, r)
		})
	}

	// 8. CHẠY SERVER
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Printf("🚀 Server API đang chạy tại cổng http://localhost:%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, corsHandler(mux)))
}