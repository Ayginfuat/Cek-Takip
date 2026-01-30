import { useState, useEffect } from 'react'
import { Plus, Calendar, DollarSign, TrendingUp, TrendingDown, X, Edit2, Trash2, QrCode, Copy, Check, Download, Smartphone, List, ChevronLeft, ChevronRight } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

function App() {
  const [checks, setChecks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingCheck, setEditingCheck] = useState(null)
  const [showQR, setShowQR] = useState(false)
  const [mobileUrl, setMobileUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [viewMode, setViewMode] = useState('list') // 'list' veya 'calendar'
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [formData, setFormData] = useState({
    type: 'outgoing', // 'outgoing' = ödenecek, 'incoming' = alınacak
    amount: '',
    bank: '',
    checkNumber: '',
    dueDate: '',
    description: '',
    status: 'pending' // 'pending', 'paid', 'received'
  })

  // LocalStorage'dan verileri yükle
  useEffect(() => {
    const savedChecks = localStorage.getItem('checks')
    if (savedChecks) {
      setChecks(JSON.parse(savedChecks))
    }
    
    // Mobil URL'yi oluştur
    const currentUrl = window.location.href
    const url = new URL(currentUrl)
    // localhost yerine IP adresini kullan
    if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
      // IP adresini bulmak için WebRTC kullan (en güvenilir yöntem)
      // Alternatif: Kullanıcıdan IP'yi al veya sunucudan gönder
      setMobileUrl('http://BILGISAYAR-IP:5173')
    } else {
      setMobileUrl(currentUrl.replace(url.hostname, url.hostname))
    }
    
    // PWA Install prompt'u yakala
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowInstallPrompt(true)
    }
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    // Zaten yüklü mü kontrol et
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallPrompt(false)
    }
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])
  
  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      // Manuel kurulum talimatları göster
      setShowInstallPrompt(true)
      return
    }
    
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    console.log(`User response to the install prompt: ${outcome}`)
    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }
  
  // IP adresini bul (basit yöntem - window.location kullan)
  const getMobileUrl = () => {
    const hostname = window.location.hostname
    const port = window.location.port || '5173'
    
    // Eğer localhost ise, kullanıcıya IP girmesini söyle
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return null // IP bulunamadı, kullanıcıdan iste
    }
    
    return `http://${hostname}:${port}`
  }
  
  const handleShowQR = () => {
    const url = getMobileUrl()
    if (url) {
      setMobileUrl(url)
      setShowQR(true)
    } else {
      // IP bulunamadı, kullanıcıdan IP iste
      const userIP = prompt('Bilgisayarınızın IP adresini girin (örnek: 192.168.1.100):')
      if (userIP) {
        setMobileUrl(`http://${userIP}:5173`)
        setShowQR(true)
      }
    }
  }
  
  const handleCopyLink = () => {
    if (mobileUrl) {
      navigator.clipboard.writeText(mobileUrl).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  // Verileri LocalStorage'a kaydet
  useEffect(() => {
    localStorage.setItem('checks', JSON.stringify(checks))
  }, [checks])

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (editingCheck) {
      // Düzenleme
      setChecks(checks.map(check => 
        check.id === editingCheck.id 
          ? { ...formData, id: editingCheck.id, createdAt: editingCheck.createdAt }
          : check
      ))
      setEditingCheck(null)
    } else {
      // Yeni ekleme
      const newCheck = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        amount: parseFloat(formData.amount)
      }
      setChecks([...checks, newCheck])
    }
    
    // Formu sıfırla
    setFormData({
      type: 'outgoing',
      amount: '',
      bank: '',
      checkNumber: '',
      dueDate: '',
      description: '',
      status: 'pending'
    })
    setShowForm(false)
  }

  const handleEdit = (check) => {
    setEditingCheck(check)
    setFormData(check)
    setShowForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Bu çeki silmek istediğinize emin misiniz?')) {
      setChecks(checks.filter(check => check.id !== id))
    }
  }

  const handleStatusChange = (id, newStatus) => {
    setChecks(checks.map(check => 
      check.id === id ? { ...check, status: newStatus } : check
    ))
  }

  const outgoingChecks = checks.filter(check => check.type === 'outgoing')
  const incomingChecks = checks.filter(check => check.type === 'incoming')
  
  const totalOutgoing = outgoingChecks
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + c.amount, 0)
  
  const totalIncoming = incomingChecks
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + c.amount, 0)

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Takvim fonksiyonları
  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    // Pazartesi başlangıcı için (0 = Pazartesi)
    const adjustedStartingDay = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1
    
    const days = []
    
    // Önceki ayın son günleri
    const prevMonth = new Date(year, month, 0)
    const prevMonthDays = prevMonth.getDate()
    for (let i = adjustedStartingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false
      })
    }
    
    // Bu ayın günleri
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      })
    }
    
    // Sonraki ayın ilk günleri (takvimi tamamlamak için)
    const remainingDays = 42 - days.length // 6 hafta x 7 gün = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      })
    }
    
    return days
  }

  const getChecksForDate = (date) => {
    if (!date) return []
    const dateStr = date.toISOString().split('T')[0]
    return checks.filter(check => {
      if (!check.dueDate) return false
      const checkDateStr = check.dueDate.split('T')[0]
      return checkDateStr === dateStr
    })
  }

  const getChecksCountForDate = (date) => {
    return getChecksForDate(date).length
  }

  const navigateMonth = (direction) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1))
  }

  const isToday = (date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear()
  }

  const isSelected = (date) => {
    if (!selectedDate) return false
    return date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear()
  }

  const CheckCard = ({ check }) => {
    const daysUntil = getDaysUntilDue(check.dueDate)
    const isOverdue = daysUntil !== null && daysUntil < 0 && check.status === 'pending'
    const isDueSoon = daysUntil !== null && daysUntil >= 0 && daysUntil <= 7 && check.status === 'pending'

    return (
      <div className={`bg-white rounded-lg shadow-md p-3 sm:p-4 border-l-4 ${
        check.status === 'paid' || check.status === 'received' 
          ? 'border-green-500 opacity-75' 
          : isOverdue 
          ? 'border-red-500' 
          : isDueSoon 
          ? 'border-yellow-500' 
          : 'border-blue-500'
      }`}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="font-semibold text-base sm:text-lg text-gray-800 break-words">
              {check.bank || 'Banka Belirtilmemiş'}
            </h3>
            {check.checkNumber && (
              <p className="text-xs sm:text-sm text-gray-600 mt-0.5">Çek No: {check.checkNumber}</p>
            )}
          </div>
          <div className="flex gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={() => handleEdit(check)}
              className="p-2 sm:p-1 text-blue-600 hover:bg-blue-50 active:bg-blue-100 rounded touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
              title="Düzenle"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => handleDelete(check.id)}
              className="p-2 sm:p-1 text-red-600 hover:bg-red-50 active:bg-red-100 rounded touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center"
              title="Sil"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        
        <div className="mb-2 sm:mb-3">
          <p className="text-xl sm:text-2xl font-bold text-gray-900 break-words">
            {formatCurrency(check.amount)}
          </p>
        </div>

        {check.description && (
          <p className="text-xs sm:text-sm text-gray-600 mb-2 break-words">{check.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
          {check.dueDate && (
            <div className="flex items-center gap-1 flex-wrap">
              <Calendar size={14} className="sm:w-4 sm:h-4" />
              <span>{formatDate(check.dueDate)}</span>
              {daysUntil !== null && check.status === 'pending' && (
                <span className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                  isOverdue 
                    ? 'bg-red-100 text-red-700' 
                    : isDueSoon 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {isOverdue ? `${Math.abs(daysUntil)} gün geçti` : `${daysUntil} gün kaldı`}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <select
            value={check.status}
            onChange={(e) => handleStatusChange(check.id, e.target.value)}
            className={`flex-1 px-3 py-2.5 sm:py-2 rounded-md text-sm font-medium border min-h-[44px] sm:min-h-0 ${
              check.status === 'paid' || check.status === 'received'
                ? 'bg-green-50 text-green-700 border-green-300'
                : 'bg-yellow-50 text-yellow-700 border-yellow-300'
            }`}
          >
            {check.type === 'outgoing' ? (
              <>
                <option value="pending">Ödenecek</option>
                <option value="paid">Ödendi</option>
              </>
            ) : (
              <>
                <option value="pending">Alınacak</option>
                <option value="received">Alındı</option>
              </>
            )}
          </select>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20 md:pb-6">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
        {/* Header */}
        <header className="mb-4 sm:mb-8">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
                Çek Takip Sistemi
              </h1>
              <p className="text-sm sm:text-base text-gray-600">Ödenecek ve alınacak çeklerinizi kolayca takip edin</p>
            </div>
            <div className="ml-4 flex gap-2">
              {(showInstallPrompt || deferredPrompt) && (
                <button
                  onClick={handleInstallApp}
                  className="p-2 sm:p-3 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white rounded-lg shadow-md transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  title="Ana Ekrana Ekle"
                >
                  <Download size={20} />
                </button>
              )}
              <button
                onClick={handleShowQR}
                className="p-2 sm:p-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg shadow-md transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Telefon için QR Kod"
              >
                <QrCode size={20} />
              </button>
            </div>
          </div>
        </header>
        
        {/* QR Kod Modal */}
        {showQR && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowQR(false)}>
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Telefon ile Bağlan</h3>
                <button
                  onClick={() => setShowQR(false)}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex flex-col items-center mb-4">
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4">
                  <QRCodeSVG value={mobileUrl} size={200} />
                </div>
                
                <div className="w-full">
                  <p className="text-sm text-gray-600 mb-2 text-center">Telefonunuzun kamerası ile QR kodu okutun</p>
                  
                  <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg mb-3">
                    <input
                      type="text"
                      value={mobileUrl}
                      readOnly
                      className="flex-1 bg-transparent text-sm text-gray-700 border-none outline-none"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Kopyala"
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                  
                  {copied && (
                    <p className="text-sm text-green-600 text-center mb-2">✓ Link kopyalandı!</p>
                  )}
                  
                  <p className="text-xs text-gray-500 text-center">
                    Veya telefonunuzun tarayıcısına yukarıdaki linki yapıştırın
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setShowQR(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        )}
        
        {/* Ana Ekrana Ekle Talimatları Modal */}
        {showInstallPrompt && !deferredPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowInstallPrompt(false)}>
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Smartphone size={24} />
                  Ana Ekrana Ekle
                </h3>
                <button
                  onClick={() => setShowInstallPrompt(false)}
                  className="p-1 text-gray-500 hover:text-gray-700 rounded"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700">
                  Uygulamayı telefonunuza bir uygulama gibi eklemek için aşağıdaki adımları izleyin:
                </p>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">📱 Android (Chrome/Samsung Internet):</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                    <li>Tarayıcı menüsünü açın (3 nokta)</li>
                    <li>"Ana ekrana ekle" veya "Add to Home screen" seçeneğini bulun</li>
                    <li>"Ekle" butonuna tıklayın</li>
                  </ol>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2">🍎 iPhone (Safari):</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                    <li>Alt kısımdaki paylaş butonuna (kare ve ok) tıklayın</li>
                    <li>"Ana Ekrana Ekle" seçeneğini bulun</li>
                    <li>"Ekle" butonuna tıklayın</li>
                  </ol>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>💡 İpucu:</strong> Uygulama ana ekranınıza eklendikten sonra, normal bir uygulama gibi açılacak ve daha hızlı çalışacaktır.
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => setShowInstallPrompt(false)}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition-colors"
              >
                Anladım
              </button>
            </div>
          </div>
        )}

        {/* Özet Kartlar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Ödenecek Çekler</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 break-words">
                  {formatCurrency(totalOutgoing)}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {outgoingChecks.filter(c => c.status === 'pending').length} adet bekleyen
                </p>
              </div>
              <TrendingDown className="text-red-500 flex-shrink-0 ml-2" size={32} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm text-gray-600 mb-1">Alınacak Çekler</p>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 break-words">
                  {formatCurrency(totalIncoming)}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {incomingChecks.filter(c => c.status === 'pending').length} adet bekleyen
                </p>
              </div>
              <TrendingUp className="text-green-500 flex-shrink-0 ml-2" size={32} />
            </div>
          </div>
        </div>

        {/* Çek Ekleme Butonu - Mobilde floating, desktop'ta normal */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => {
              setShowForm(!showForm)
              setEditingCheck(null)
              setFormData({
                type: 'outgoing',
                amount: '',
                bank: '',
                checkNumber: '',
                dueDate: '',
                description: '',
                status: 'pending'
              })
            }}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-3.5 sm:py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md transition-colors touch-manipulation min-h-[44px] text-base"
          >
            <Plus size={20} />
            <span>{showForm ? 'Formu Kapat' : 'Yeni Çek Ekle'}</span>
          </button>
        </div>

        {/* Çek Ekleme/Düzenleme Formu */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-4 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
              {editingCheck ? 'Çeki Düzenle' : 'Yeni Çek Ekle'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Çek Türü *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base min-h-[44px]"
                    required
                  >
                    <option value="outgoing">Ödenecek Çek</option>
                    <option value="incoming">Alınacak Çek</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Tutar (₺) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base min-h-[44px]"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Banka *
                  </label>
                  <input
                    type="text"
                    value={formData.bank}
                    onChange={(e) => setFormData({ ...formData, bank: e.target.value })}
                    className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base min-h-[44px]"
                    placeholder="Banka adı"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Çek Numarası
                  </label>
                  <input
                    type="text"
                    value={formData.checkNumber}
                    onChange={(e) => setFormData({ ...formData, checkNumber: e.target.value })}
                    className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base min-h-[44px]"
                    placeholder="Çek numarası (opsiyonel)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Vade Tarihi *
                  </label>
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base min-h-[44px]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Durum
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base min-h-[44px]"
                  >
                    <option value="pending">
                      {formData.type === 'outgoing' ? 'Ödenecek' : 'Alınacak'}
                    </option>
                    <option value={formData.type === 'outgoing' ? 'paid' : 'received'}>
                      {formData.type === 'outgoing' ? 'Ödendi' : 'Alındı'}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Açıklama
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  rows="3"
                  placeholder="Ek notlar (opsiyonel)"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors touch-manipulation min-h-[44px] text-base"
                >
                  {editingCheck ? 'Güncelle' : 'Kaydet'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingCheck(null)
                    setFormData({
                      type: 'outgoing',
                      amount: '',
                      bank: '',
                      checkNumber: '',
                      dueDate: '',
                      description: '',
                      status: 'pending'
                    })
                  }}
                  className="flex-1 sm:flex-none bg-gray-300 hover:bg-gray-400 active:bg-gray-500 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-colors touch-manipulation min-h-[44px] text-base"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Görünüm Modu Seçici */}
        <div className="mb-4 sm:mb-6 flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-semibold transition-colors min-h-[44px] flex items-center justify-center gap-2 ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <List size={18} />
            <span>Liste</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-semibold transition-colors min-h-[44px] flex items-center justify-center gap-2 ${
              viewMode === 'calendar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Calendar size={18} />
            <span>Takvim</span>
          </button>
        </div>

        {/* Takvim Görünümü */}
        {viewMode === 'calendar' && (
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-8">
            {/* Takvim Başlığı */}
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                {currentMonth.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            {/* Hafta Günleri */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
              {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, index) => (
                <div key={index} className="text-center text-xs sm:text-sm font-semibold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Takvim Günleri */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {getDaysInMonth(currentMonth).map((dayObj, index) => {
                const checksCount = getChecksCountForDate(dayObj.date)
                const dayChecks = getChecksForDate(dayObj.date)
                const hasPendingChecks = dayChecks.some(c => c.status === 'pending')
                const hasOverdueChecks = dayChecks.some(c => {
                  const days = getDaysUntilDue(c.dueDate)
                  return days !== null && days < 0 && c.status === 'pending'
                })

                return (
                  <div
                    key={index}
                    onClick={() => {
                      if (dayObj.isCurrentMonth) {
                        setSelectedDate(dayObj.date)
                      }
                    }}
                    className={`min-h-[60px] sm:min-h-[80px] p-1 sm:p-2 rounded-lg border-2 transition-all cursor-pointer ${
                      !dayObj.isCurrentMonth
                        ? 'bg-gray-50 text-gray-400 border-gray-100'
                        : isSelected(dayObj.date)
                        ? 'bg-blue-100 border-blue-500'
                        : isToday(dayObj.date)
                        ? 'bg-yellow-50 border-yellow-300'
                        : 'bg-white border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="flex flex-col h-full">
                      <div className={`text-xs sm:text-sm font-semibold mb-1 ${
                        !dayObj.isCurrentMonth ? 'text-gray-400' : 'text-gray-700'
                      }`}>
                        {dayObj.date.getDate()}
                      </div>
                      {checksCount > 0 && (
                        <div className="flex flex-wrap gap-0.5 mt-auto">
                          {dayChecks.slice(0, 3).map((check, idx) => (
                            <div
                              key={check.id}
                              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                                check.status === 'paid' || check.status === 'received'
                                  ? 'bg-green-400'
                                  : hasOverdueChecks && check.status === 'pending'
                                  ? 'bg-red-500'
                                  : 'bg-blue-500'
                              }`}
                              title={`${check.bank} - ${formatCurrency(check.amount)}`}
                            />
                          ))}
                          {checksCount > 3 && (
                            <div className="text-[8px] sm:text-xs text-gray-500 font-semibold">
                              +{checksCount - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Seçili Günün Çekleri */}
            {selectedDate && (
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-bold text-gray-800">
                    {formatDate(selectedDate.toISOString())} - Çekler
                  </h3>
                  <button
                    onClick={() => setSelectedDate(null)}
                    className="p-1 text-gray-500 hover:text-gray-700 rounded"
                  >
                    <X size={20} />
                  </button>
                </div>
                {getChecksForDate(selectedDate).length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Bu tarihte çek bulunmuyor
                  </p>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {getChecksForDate(selectedDate).map(check => (
                      <CheckCard key={check.id} check={check} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Renk Açıklamaları */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-gray-600">Bekleyen Çek</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-gray-600">Vadesi Geçmiş</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="text-gray-600">Ödendi/Alındı</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-300 border-2 border-yellow-400"></div>
                  <span className="text-gray-600">Bugün</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Çek Listeleri */}
        {viewMode === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Ödenecek Çekler */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <TrendingDown className="text-red-500 flex-shrink-0" size={20} />
              <span>Ödenecek Çekler</span>
            </h2>
            {outgoingChecks.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center text-gray-500">
                <DollarSign className="mx-auto mb-2 text-gray-400" size={40} />
                <p className="text-sm sm:text-base">Henüz ödenecek çek eklenmemiş</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {outgoingChecks.map(check => (
                  <CheckCard key={check.id} check={check} />
                ))}
              </div>
            )}
          </div>

          {/* Alınacak Çekler */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <TrendingUp className="text-green-500 flex-shrink-0" size={20} />
              <span>Alınacak Çekler</span>
            </h2>
            {incomingChecks.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 sm:p-8 text-center text-gray-500">
                <DollarSign className="mx-auto mb-2 text-gray-400" size={40} />
                <p className="text-sm sm:text-base">Henüz alınacak çek eklenmemiş</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {incomingChecks.map(check => (
                  <CheckCard key={check.id} check={check} />
                ))}
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  )
}

export default App
