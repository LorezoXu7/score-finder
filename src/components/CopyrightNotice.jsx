export default function CopyrightNotice({ score, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: 16,
      }}
      onClick={onCancel}
    >
      <div
        className="card"
        style={{
          maxWidth: 420,
          width: '100%',
          padding: 24,
          textAlign: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>📜</div>
        <h3 style={{ fontSize: 18, color: '#4E342E', marginBottom: 8 }}>
          版权提醒
        </h3>
        <p style={{ fontSize: 14, color: '#6D4C41', marginBottom: 16, lineHeight: 1.7 }}>
          你即将下载的乐谱 <strong>{score?.title || ''}</strong> 来自
          IMSLP 或其他公开乐谱资源。
          <br /><br />
          请确认你下载的乐谱在所在地区属于<strong>公共版权</strong>或你有合法使用权。
          请勿将下载的乐谱用于商业用途。
        </p>
        <div
          style={{
            background: '#FFF8E1',
            border: '1px solid #D4A853',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: 13,
            color: '#6D4C41',
            marginBottom: 20,
            textAlign: 'left',
          }}
        >
          💡 提示：IMSLP 上标注「Public Domain」的谱子可自由下载使用
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={onCancel}>
            取消
          </button>
          <button className="btn btn-primary" onClick={onConfirm}>
            我已知晓，继续下载
          </button>
        </div>
      </div>
    </div>
  )
}
