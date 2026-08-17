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
      case 'RETRIEVAL_UNAVAILABLE':
        return 'Dịch vụ truy xuất nguồn thơ hiện chưa sẵn sàng.'
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
