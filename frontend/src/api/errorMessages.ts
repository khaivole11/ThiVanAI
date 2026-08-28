import { ApiClientError } from './client'

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError'
}

export function toUserMessage(error: unknown): string {
  if (isAbortError(error)) {
    return 'Thao tác đã bị hủy.'
  }

  if (error instanceof ApiClientError) {
    switch (error.code) {
      case 'GENERATOR_UNAVAILABLE':
        return 'Dịch vụ AI hiện chưa sẵn sàng. Vui lòng thử lại sau.'
      case 'GENERATION_VALIDATION_FAILED':
        return 'Hệ thống chưa tạo được bài thơ đúng thể thơ sau nhiều lần thử. Vui lòng thử lại hoặc đổi câu mở đầu.'
      case 'RETRIEVAL_UNAVAILABLE':
      case 'RETRIEVAL_NOT_READY':
        return 'Dịch vụ truy xuất nguồn thơ hiện chưa sẵn sàng.'
      case 'FEEDBACK_STORE_NOT_CONFIGURED':
        return 'Backend chưa cấu hình Supabase để lưu phản hồi.'
      case 'FEEDBACK_STORE_UNAVAILABLE':
      case 'FEEDBACK_STORE_REJECTED':
      case 'FEEDBACK_STORE_INVALID_RESPONSE':
        return 'Chưa thể lưu phản hồi vào Supabase. Vui lòng thử lại sau.'
      default:
        break
    }

    if (error.status === 422) {
      return `Dữ liệu không hợp lệ: ${error.message}`
    }

    if (error.status >= 500) {
      return 'Máy chủ gặp lỗi khi xử lý. Vui lòng thử lại sau.'
    }

    return error.message
  }

  if (error instanceof TypeError) {
    return 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra lại mạng hoặc backend.'
  }

  return 'Đã xảy ra lỗi không xác định.'
}
