import { useState, useEffect } from 'react'
import { Plus, Calendar, DollarSign, TrendingUp, TrendingDown, X, Edit2, Trash2, QrCode, Copy, Check, Download, Smartphone, List, ChevronLeft, ChevronRight, BarChart3, PieChart } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { BarChart, Bar, LineChart, Line, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function App() {
  const [checks, setChecks] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingCheck, setEditingCheck] = useState(null)
  const [showQR, setShowQR] = useState(false)
  const [mobileUrl, setMobileUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [viewMode, setViewMode] = useState('list') // 'list', 'calendar' veya 'analysis'
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [formData, setFormData] = useState({
    type: 'outgoing', // 'outgoing' = ödenecek, 'incoming' = alınacak
    amount: '',
    bank: '',
    checkNumber: '',
    dueDate: '',
    description: '',
    status: 'pending' // 'pending', 'paid', 'received'
  })

  // Mobil cihaz kontrolü
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

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

  const getOutgoingChecksForDate = (date) => {
    return getChecksForDate(date).filter(check => check.type === 'outgoing')
  }

  const getIncomingChecksForDate = (date) => {
    return getChecksForDate(date).filter(check => check.type === 'incoming')
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

  // Analiz fonksiyonları
  const getMonthlyData = () => {
    const monthlyData = {}
    const today = new Date()
    
    checks.forEach(check => {
      if (!check.dueDate) return
      const dueDate = new Date(check.dueDate)
      const monthKey = `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, '0')}`
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: dueDate.toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }),
          outgoing: 0,
          incoming: 0,
          outgoingPaid: 0,
          incomingReceived: 0
        }
      }
      
      if (check.type === 'outgoing') {
        if (check.status === 'pending') {
          monthlyData[monthKey].outgoing += check.amount
        } else {
          monthlyData[monthKey].outgoingPaid += check.amount
        }
      } else {
        if (check.status === 'pending') {
          monthlyData[monthKey].incoming += check.amount
        } else {
          monthlyData[monthKey].incomingReceived += check.amount
        }
      }
    })
    
    return Object.values(monthlyData).sort((a, b) => {
      const aDate = new Date(a.month)
      const bDate = new Date(b.month)
      return aDate - bDate
    })
  }

  const getStatusData = () => {
    const outgoingPending = outgoingChecks.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0)
    const outgoingPaid = outgoingChecks.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0)
    const incomingPending = incomingChecks.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0)
    const incomingReceived = incomingChecks.filter(c => c.status === 'received').reduce((sum, c) => sum + c.amount, 0)
    
    return [
      { name: 'Ödenecek', value: outgoingPending, color: '#ef4444' },
      { name: 'Ödendi', value: outgoingPaid, color: '#22c55e' },
      { name: 'Alınacak', value: incomingPending, color: '#3b82f6' },
      { name: 'Alındı', value: incomingReceived, color: '#10b981' }
    ].filter(item => item.value > 0)
  }

  const getBankData = () => {
    const bankData = {}
    
    checks.forEach(check => {
      const bank = check.bank || 'Banka Belirtilmemiş'
      if (!bankData[bank]) {
        bankData[bank] = { outgoing: 0, incoming: 0 }
      }
      
      if (check.status === 'pending') {
        if (check.type === 'outgoing') {
          bankData[bank].outgoing += check.amount
        } else {
          bankData[bank].incoming += check.amount
        }
      }
    })
    
    return Object.entries(bankData)
      .map(([name, data]) => ({
        name: name.length > 15 ? name.substring(0, 15) + '...' : name,
        'Ödenecek': data.outgoing,
        'Alınacak': data.incoming
      }))
      .sort((a, b) => (b['Ödenecek'] + b['Alınacak']) - (a['Ödenecek'] + a['Alınacak']))
      .slice(0, 10) // En fazla 10 banka
  }

  const getDueDateAnalysis = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const overdue = checks.filter(c => {
      if (!c.dueDate || c.status !== 'pending') return false
      const due = new Date(c.dueDate)
      due.setHours(0, 0, 0, 0)
      return due < today
    }).reduce((sum, c) => sum + c.amount, 0)
    
    const thisWeek = checks.filter(c => {
      if (!c.dueDate || c.status !== 'pending') return false
      const due = new Date(c.dueDate)
      due.setHours(0, 0, 0, 0)
      const weekEnd = new Date(today)
      weekEnd.setDate(weekEnd.getDate() + 7)
      return due >= today && due <= weekEnd
    }).reduce((sum, c) => sum + c.amount, 0)
    
    const thisMonth = checks.filter(c => {
      if (!c.dueDate || c.status !== 'pending') return false
      const due = new Date(c.dueDate)
      due.setHours(0, 0, 0, 0)
      const monthEnd = new Date(today)
      monthEnd.setMonth(monthEnd.getMonth() + 1)
      return due > weekEnd && due <= monthEnd
    }).reduce((sum, c) => sum + c.amount, 0)
    
    const later = checks.filter(c => {
      if (!c.dueDate || c.status !== 'pending') return false
      const due = new Date(c.dueDate)
      due.setHours(0, 0, 0, 0)
      const monthEnd = new Date(today)
      monthEnd.setMonth(monthEnd.getMonth() + 1)
      return due > monthEnd
    }).reduce((sum, c) => sum + c.amount, 0)
    
    return [
      { name: 'Vadesi Geçmiş', value: overdue, color: '#ef4444' },
      { name: 'Bu Hafta', value: thisWeek, color: '#f59e0b' },
      { name: 'Bu Ay', value: thisMonth, color: '#3b82f6' },
      { name: 'Daha Sonra', value: later, color: '#6b7280' }
    ].filter(item => item.value > 0)
  }

  const getSummaryStats = () => {
    const totalOutgoingPending = outgoingChecks.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0)
    const totalOutgoingPaid = outgoingChecks.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.amount, 0)
    const totalIncomingPending = incomingChecks.filter(c => c.status === 'pending').reduce((sum, c) => sum + c.amount, 0)
    const totalIncomingReceived = incomingChecks.filter(c => c.status === 'received').reduce((sum, c) => sum + c.amount, 0)
    const netAmount = totalIncomingPending - totalOutgoingPending
    
    return {
      totalOutgoingPending,
      totalOutgoingPaid,
      totalIncomingPending,
      totalIncomingReceived,
      netAmount
    }
  }

  const COLORS = ['#ef4444', '#22c55e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']

  const CheckCard = ({ check }) => {
    const daysUntil = getDaysUntilDue(check.dueDate)
    const isOverdue = daysUntil !== null && daysUntil < 0 && check.status === 'pending'
    const isDueSoon = daysUntil !== null && daysUntil >= 0 && daysUntil <= 7 && check.status === 'pending'

    return (
      <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-4 sm:p-5 border-l-4 ${
        check.status === 'paid' || check.status === 'received' 
          ? 'border-emerald-500 bg-emerald-50/30' 
          : isOverdue 
          ? 'border-rose-500 bg-rose-50/30' 
          : isDueSoon 
          ? 'border-amber-500 bg-amber-50/30' 
          : 'border-indigo-500 bg-indigo-50/20'
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
              className="p-2 sm:p-1.5 text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 rounded-lg touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center transition-colors duration-200"
              title="Düzenle"
            >
              <Edit2 size={18} />
            </button>
            <button
              onClick={() => handleDelete(check.id)}
              className="p-2 sm:p-1.5 text-rose-600 hover:bg-rose-50 active:bg-rose-100 rounded-lg touch-manipulation min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 flex items-center justify-center transition-colors duration-200"
              title="Sil"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
        
        <div className="mb-2 sm:mb-3">
          <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent break-words">
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
                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap ${
                  isOverdue 
                    ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                    : isDueSoon 
                    ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
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
            className={`flex-1 px-4 py-2.5 sm:py-2.5 rounded-lg text-sm font-semibold border-2 min-h-[44px] sm:min-h-0 transition-all duration-200 ${
              check.status === 'paid' || check.status === 'received'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 pb-20 md:pb-6">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 max-w-7xl">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 bg-clip-text text-transparent mb-2 sm:mb-3">
                Çek Takip Sistemi
              </h1>
              <p className="text-sm sm:text-base text-slate-600 font-medium">Ödenecek ve alınacak çeklerinizi kolayca takip edin</p>
            </div>
            <div className="ml-4 flex gap-2">
              {(showInstallPrompt || deferredPrompt) && (
                <button
                  onClick={handleInstallApp}
                  className="p-2 sm:p-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:from-emerald-700 active:to-teal-800 text-white rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-200 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center hover:shadow-xl hover:shadow-emerald-500/30"
                  title="Ana Ekrana Ekle"
                >
                  <Download size={20} />
                </button>
              )}
              <button
                onClick={handleShowQR}
                className="p-2 sm:p-3 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 active:from-indigo-700 active:to-blue-800 text-white rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center hover:shadow-xl hover:shadow-indigo-500/30"
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
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8 max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
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
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200"
                >
                  Kapat
                </button>
            </div>
          </div>
        )}
        
        {/* Ana Ekrana Ekle Talimatları Modal */}
        {showInstallPrompt && !deferredPrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowInstallPrompt(false)}>
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 sm:p-8 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
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
                className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200"
              >
                Anladım
              </button>
            </div>
          </div>
        )}

        {/* Özet Kartlar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl shadow-lg shadow-rose-500/10 p-5 sm:p-7 border border-rose-100 relative overflow-hidden group hover:shadow-xl hover:shadow-rose-500/15 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-100/50 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-rose-600 uppercase tracking-wide mb-2">Ödenecek Çekler</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-600 to-rose-700 bg-clip-text text-transparent break-words mb-1">
                  {formatCurrency(totalOutgoing)}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
                  {outgoingChecks.filter(c => c.status === 'pending').length} adet bekleyen
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-xl shadow-lg shadow-rose-500/30 ml-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingDown className="text-white" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg shadow-emerald-500/10 p-5 sm:p-7 border border-emerald-100 relative overflow-hidden group hover:shadow-xl hover:shadow-emerald-500/15 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100/50 to-transparent rounded-full -mr-16 -mt-16"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-2">Alınacak Çekler</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent break-words mb-1">
                  {formatCurrency(totalIncoming)}
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mt-2 font-medium">
                  {incomingChecks.filter(c => c.status === 'pending').length} adet bekleyen
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-500/30 ml-4 group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="text-white" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Çek Ekleme Butonu - Mobilde floating, desktop'ta normal */}
        <div className="mb-6 sm:mb-8">
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
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-600 hover:from-indigo-700 hover:via-blue-700 hover:to-indigo-700 active:from-indigo-800 active:via-blue-800 active:to-indigo-800 text-white px-8 py-4 sm:py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200 touch-manipulation min-h-[44px] text-base"
          >
            <Plus size={20} />
            <span>{showForm ? 'Formu Kapat' : 'Yeni Çek Ekle'}</span>
          </button>
        </div>

        {/* Çek Ekleme/Düzenleme Formu */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-5 sm:p-7 mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-4 sm:mb-6">
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
                    className="w-full px-4 py-3 sm:py-2.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base min-h-[44px] transition-all duration-200 bg-white hover:border-slate-300"
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
                    className="w-full px-4 py-3 sm:py-2.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base min-h-[44px] transition-all duration-200 bg-white hover:border-slate-300"
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
                    className="w-full px-4 py-3 sm:py-2.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base min-h-[44px] transition-all duration-200 bg-white hover:border-slate-300"
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
                    className="w-full px-4 py-3 sm:py-2.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base min-h-[44px] transition-all duration-200 bg-white hover:border-slate-300"
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
                    className="w-full px-4 py-3 sm:py-2.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base min-h-[44px] transition-all duration-200 bg-white hover:border-slate-300"
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
                    className="w-full px-4 py-3 sm:py-2.5 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base min-h-[44px] transition-all duration-200 bg-white hover:border-slate-300"
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
                  className="flex-1 sm:flex-none bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 active:from-indigo-800 active:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200 touch-manipulation min-h-[44px] text-base"
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
                  className="flex-1 sm:flex-none bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 border-2 border-slate-200 px-8 py-3 rounded-xl font-semibold transition-all duration-200 touch-manipulation min-h-[44px] text-base"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Görünüm Modu Seçici */}
        <div className="mb-4 sm:mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setViewMode('list')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 min-h-[44px] flex items-center justify-center gap-2 ${
              viewMode === 'list'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <List size={18} />
            <span>Liste</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 min-h-[44px] flex items-center justify-center gap-2 ${
              viewMode === 'calendar'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <Calendar size={18} />
            <span>Takvim</span>
          </button>
          <button
            onClick={() => setViewMode('analysis')}
            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 min-h-[44px] flex items-center justify-center gap-2 ${
              viewMode === 'analysis'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            <BarChart3 size={18} />
            <span>Analiz</span>
          </button>
        </div>

        {/* Takvim Görünümü */}
        {viewMode === 'calendar' && (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-5 sm:p-7 mb-6 sm:mb-8">
            {/* Takvim Başlığı */}
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 hover:scale-110"
              >
                <ChevronLeft size={20} className="text-slate-700" />
              </button>
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent">
                {currentMonth.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
              </h2>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 hover:scale-110"
              >
                <ChevronRight size={20} className="text-slate-700" />
              </button>
            </div>

            {/* Hafta Günleri */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3">
              {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map((day, index) => (
                <div key={index} className="text-center text-xs sm:text-sm font-bold text-slate-600 py-2.5 bg-slate-50 rounded-lg">
                  {day}
                </div>
              ))}
            </div>

            {/* Takvim Günleri */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2">
              {getDaysInMonth(currentMonth).map((dayObj, index) => {
                const dayChecks = getChecksForDate(dayObj.date)
                const outgoingChecks = getOutgoingChecksForDate(dayObj.date)
                const incomingChecks = getIncomingChecksForDate(dayObj.date)
                const outgoingPending = outgoingChecks.filter(c => c.status === 'pending')
                const incomingPending = incomingChecks.filter(c => c.status === 'pending')
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
                    className={`min-h-[90px] sm:min-h-[110px] p-1.5 sm:p-2.5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      !dayObj.isCurrentMonth
                        ? 'bg-slate-50 text-slate-400 border-slate-100'
                        : isSelected(dayObj.date)
                        ? 'bg-gradient-to-br from-indigo-100 to-blue-100 border-indigo-400 shadow-md'
                        : isToday(dayObj.date)
                        ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300 shadow-sm'
                        : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex flex-col h-full">
                      <div className={`text-xs sm:text-sm font-bold mb-1.5 ${
                        !dayObj.isCurrentMonth ? 'text-slate-400' : isToday(dayObj.date) ? 'text-amber-700' : 'text-slate-800'
                      }`}>
                        {dayObj.date.getDate()}
                      </div>
                      <div className="flex flex-col gap-0.5 sm:gap-1 mt-auto text-[8px] sm:text-xs">
                        {outgoingPending.length > 0 && (
                          <div className="flex items-center gap-0.5 sm:gap-1">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-red-500 flex-shrink-0"></div>
                            <span className={`font-semibold truncate text-[9px] sm:text-xs ${
                              !dayObj.isCurrentMonth ? 'text-slate-400' : 'text-rose-700'
                            }`}>
                              {outgoingPending.length} adet ödenecek
                            </span>
                          </div>
                        )}
                        {incomingPending.length > 0 && (
                          <div className="flex items-center gap-0.5 sm:gap-1">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 flex-shrink-0 shadow-sm"></div>
                            <span className={`font-semibold truncate text-[9px] sm:text-xs ${
                              !dayObj.isCurrentMonth ? 'text-slate-400' : 'text-emerald-700'
                            }`}>
                              {incomingPending.length} adet alınacak
                            </span>
                          </div>
                        )}
                        {outgoingChecks.filter(c => c.status === 'paid').length > 0 && (
                          <div className="flex items-center gap-0.5 sm:gap-1 opacity-70">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-slate-400 flex-shrink-0"></div>
                            <span className={`font-semibold truncate text-[9px] sm:text-xs ${
                              !dayObj.isCurrentMonth ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                              {outgoingChecks.filter(c => c.status === 'paid').length} adet ödendi
                            </span>
                          </div>
                        )}
                        {incomingChecks.filter(c => c.status === 'received').length > 0 && (
                          <div className="flex items-center gap-0.5 sm:gap-1 opacity-70">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-slate-400 flex-shrink-0"></div>
                            <span className={`font-semibold truncate text-[9px] sm:text-xs ${
                              !dayObj.isCurrentMonth ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                              {incomingChecks.filter(c => c.status === 'received').length} adet alındı
                            </span>
                          </div>
                        )}
                      </div>
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
            <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-slate-200">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-2 bg-rose-50 px-3 py-2 rounded-lg border border-rose-100">
                  <div className="w-3 h-3 rounded-full bg-rose-500 shadow-sm"></div>
                  <span className="text-slate-700 font-medium">Ödenecek Çek</span>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></div>
                  <span className="text-slate-700 font-medium">Alınacak Çek</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                  <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                  <span className="text-slate-700 font-medium">Ödendi/Alındı</span>
                </div>
                <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">
                  <div className="w-3 h-3 rounded-full bg-amber-400 border-2 border-amber-500"></div>
                  <span className="text-slate-700 font-medium">Bugün</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analiz Görünümü */}
        {viewMode === 'analysis' && (
          <div className="space-y-4 sm:space-y-6">
            {checks.length === 0 && (
              <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-2xl shadow-lg border border-slate-200 p-10 sm:p-12 text-center">
                <div className="p-5 bg-white rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <BarChart3 className="text-indigo-500" size={40} />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-3">Henüz Çek Eklenmemiş</h3>
                <p className="text-slate-600 mb-6 font-medium">Analiz grafiklerini görmek için önce çek eklemeniz gerekiyor.</p>
                <button
                  onClick={() => {
                    setViewMode('list')
                    setShowForm(true)
                  }}
                  className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 transition-all duration-200"
                >
                  İlk Çeki Ekle
                </button>
              </div>
            )}
            {checks.length > 0 && (
              <>
                {/* Özet İstatistikler */}
                {(() => {
              const stats = getSummaryStats()
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="bg-white rounded-2xl shadow-lg shadow-rose-500/10 p-5 sm:p-6 border border-rose-100 hover:shadow-xl hover:shadow-rose-500/15 transition-all duration-300">
                    <p className="text-xs sm:text-sm font-semibold text-rose-600 uppercase tracking-wide mb-2">Toplam Ödenecek</p>
                    <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-600 to-rose-700 bg-clip-text text-transparent mb-1">{formatCurrency(stats.totalOutgoingPending)}</p>
                    <p className="text-xs text-slate-500 mt-2 font-medium">{outgoingChecks.filter(c => c.status === 'pending').length} adet</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg shadow-emerald-500/10 p-5 sm:p-6 border border-emerald-100 hover:shadow-xl hover:shadow-emerald-500/15 transition-all duration-300">
                    <p className="text-xs sm:text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-2">Toplam Alınacak</p>
                    <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">{formatCurrency(stats.totalIncomingPending)}</p>
                    <p className="text-xs text-slate-500 mt-2 font-medium">{incomingChecks.filter(c => c.status === 'pending').length} adet</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg shadow-indigo-500/10 p-5 sm:p-6 border border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/15 transition-all duration-300">
                    <p className="text-xs sm:text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-2">Net Durum</p>
                    <p className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r bg-clip-text text-transparent mb-1 ${stats.netAmount >= 0 ? 'from-emerald-600 to-teal-600' : 'from-rose-600 to-rose-700'}`}>
                      {formatCurrency(Math.abs(stats.netAmount))}
                    </p>
                    <p className={`text-xs mt-2 font-medium ${stats.netAmount >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{stats.netAmount >= 0 ? 'Alacak' : 'Borç'}</p>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg shadow-purple-500/10 p-5 sm:p-6 border border-purple-100 hover:shadow-xl hover:shadow-purple-500/15 transition-all duration-300">
                    <p className="text-xs sm:text-sm font-semibold text-purple-600 uppercase tracking-wide mb-2">Toplam İşlem</p>
                    <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-1">{formatCurrency(stats.totalOutgoingPaid + stats.totalIncomingReceived)}</p>
                    <p className="text-xs text-slate-500 mt-2 font-medium">Ödendi/Alındı</p>
                  </div>
                </div>
              )
            })()}

            {/* Aylık Dağılım Grafiği */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-5 sm:p-7">
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-5 sm:mb-6 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg shadow-md">
                  <BarChart3 size={20} className="text-white" />
                </div>
                Aylık Dağılım
              </h3>
              {getMonthlyData().length > 0 ? (
                <div className="w-full" style={{ minHeight: '300px' }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getMonthlyData()} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="month" 
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis 
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        width={60}
                      />
                      <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '8px'
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                        iconSize={12}
                      />
                      <Bar dataKey="outgoing" fill="#ef4444" name="Ödenecek" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="incoming" fill="#3b82f6" name="Alınacak" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="outgoingPaid" fill="#22c55e" name="Ödendi" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="incomingReceived" fill="#10b981" name="Alındı" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  <p>Henüz veri bulunmuyor. Çek ekledikten sonra grafik görünecektir.</p>
                </div>
              )}
            </div>

            {/* Durum Dağılımı */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-5 sm:p-7">
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-5 sm:mb-6 flex items-center gap-2">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-md">
                  <PieChart size={20} className="text-white" />
                </div>
                Durum Dağılımı
              </h3>
              {getStatusData().length > 0 ? (
                <div className="w-full" style={{ minHeight: '300px' }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={getStatusData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => {
                          if (isMobile) {
                            return `${(percent * 100).toFixed(0)}%`
                          }
                          return `${name}: ${(percent * 100).toFixed(0)}%`
                        }}
                        outerRadius={isMobile ? 70 : 80}
                        innerRadius={isMobile ? 20 : 30}
                        fill="#8884d8"
                        dataKey="value"
                        style={{ fontSize: '12px' }}
                      >
                        {getStatusData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                        iconSize={12}
                        layout="horizontal"
                        verticalAlign="bottom"
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  <p>Henüz veri bulunmuyor. Çek ekledikten sonra grafik görünecektir.</p>
                </div>
              )}
            </div>

            {/* Banka Bazında Dağılım */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-5 sm:p-7">
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-5 sm:mb-6">Banka Bazında Dağılım</h3>
              {getBankData().length > 0 ? (
                <div className="w-full overflow-x-auto" style={{ minHeight: '300px' }}>
                  <ResponsiveContainer width="100%" height={Math.max(300, getBankData().length * 40)}>
                    <BarChart data={getBankData()} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis 
                        type="number" 
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        width={60}
                      />
                      <YAxis 
                        dataKey="name" 
                        type="category" 
                        width={isMobile ? 80 : 120}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                      />
                      <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                        iconSize={12}
                      />
                      <Bar dataKey="Ödenecek" fill="#ef4444" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="Alınacak" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  <p>Henüz veri bulunmuyor. Çek ekledikten sonra grafik görünecektir.</p>
                </div>
              )}
            </div>

            {/* Vade Tarihi Analizi */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-5 sm:p-7">
              <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-700 bg-clip-text text-transparent mb-5 sm:mb-6">Vade Tarihi Analizi</h3>
              {getDueDateAnalysis().length > 0 ? (
                <div className="w-full" style={{ minHeight: '300px' }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={getDueDateAnalysis()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => {
                          if (isMobile) {
                            return `${(percent * 100).toFixed(0)}%`
                          }
                          return `${name}: ${(percent * 100).toFixed(0)}%`
                        }}
                        outerRadius={isMobile ? 70 : 80}
                        innerRadius={isMobile ? 20 : 30}
                        fill="#8884d8"
                        dataKey="value"
                        style={{ fontSize: '12px' }}
                      >
                        {getDueDateAnalysis().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Legend 
                        wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
                        iconSize={12}
                        layout="horizontal"
                        verticalAlign="bottom"
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  <p>Henüz veri bulunmuyor. Vade tarihi olan çek ekledikten sonra grafik görünecektir.</p>
                </div>
              )}
            </div>
              </>
            )}
          </div>
        )}

        {/* Çek Listeleri */}
        {viewMode === 'list' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Ödenecek Çekler */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-rose-600 to-rose-700 bg-clip-text text-transparent mb-4 sm:mb-5 flex items-center gap-2">
              <TrendingDown className="text-rose-500 flex-shrink-0" size={22} />
              <span>Ödenecek Çekler</span>
            </h2>
            {outgoingChecks.length === 0 ? (
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-md border border-slate-200 p-8 sm:p-10 text-center">
                <div className="p-4 bg-white rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-md">
                  <DollarSign className="text-slate-400" size={32} />
                </div>
                <p className="text-sm sm:text-base font-medium text-slate-600">Henüz ödenecek çek eklenmemiş</p>
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
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4 sm:mb-5 flex items-center gap-2">
              <TrendingUp className="text-emerald-500 flex-shrink-0" size={22} />
              <span>Alınacak Çekler</span>
            </h2>
            {incomingChecks.length === 0 ? (
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-md border border-slate-200 p-8 sm:p-10 text-center">
                <div className="p-4 bg-white rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-md">
                  <DollarSign className="text-slate-400" size={32} />
                </div>
                <p className="text-sm sm:text-base font-medium text-slate-600">Henüz alınacak çek eklenmemiş</p>
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
