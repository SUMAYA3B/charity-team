import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, componentStack: '' }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    this.setState({ componentStack: info?.componentStack || '' })
    console.error('ErrorBoundary caught:', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, componentStack: '' })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="d-flex flex-column align-items-center justify-content-center text-center py-5">
          <i className="bi bi-exclamation-triangle text-warning display-3 mb-3"></i>
          <h4 className="fw-bold mb-2">حدث خطأ غير متوقع</h4>
          <p className="text-muted mb-3">تعذر عرض هذا المحتوى. حاول إعادة تحميل الصفحة.</p>
          {this.props.showError && (
            <div className="text-start bg-light p-2 rounded small text-danger" dir="ltr" style={{ maxWidth: '90%', overflow: 'auto', maxHeight: '300px' }}>
              <div><strong>الخطأ:</strong> {this.state.error?.message}</div>
              {this.state.error?.stack && (
                <pre className="mt-2 mb-0" style={{ whiteSpace: 'pre-wrap', fontSize: '0.75rem' }}>{this.state.error.stack}</pre>
              )}
              {this.state.componentStack && (
                <pre className="mt-2 mb-0" style={{ whiteSpace: 'pre-wrap', fontSize: '0.75rem' }}>{this.state.componentStack}</pre>
              )}
            </div>
          )}
          <button className="btn btn-primary mt-3" onClick={this.handleReset}>
            <i className="bi bi-arrow-clockwise me-1"></i>إعادة التحميل
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
