"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  CalendarIcon,
  MapPin,
  Phone,
  Tag,
  Utensils,
  PartyPopper,
  Building2,
  CheckCircle2,
  Loader2,
  ChevronDown,
  X,
  Check,
} from "lucide-react"


const API_BASE = "/api/proxy"


type MenuItem = { m_id?: string; id?: string; m_title?: string; title?: string; m_code?: string }
type BranchItem = { id?: string; branch_id?: string; b_id?: string; title?: string; branch_name?: string }

interface FormData {
  tagId: string
  name: string
  phoneNumber: string
  birthday: string
  favoriteMenuCode: string
  frequentedBiggsLocationId: string
  interestedInEvents: boolean
  interestedInFranchise: boolean
}

// ---------------------------------------------------------------------------
// MultiSelect
// ---------------------------------------------------------------------------
interface MultiSelectProps {
  options: MenuItem[]
  selected: string[]
  onChange: (next: string[]) => void
  hasError?: boolean
  isLoading?: boolean
  hasLoadError?: boolean
}

function MultiSelect({
  options,
  selected,
  onChange,
  hasError = false,
  isLoading = false,
  hasLoadError = false,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [portalStyle, setPortalStyle] = useState<React.CSSProperties>({})
  const triggerRef = useRef<HTMLDivElement>(null)

  const openDropdown = useCallback(() => {
    if (triggerRef.current) {
      const r = triggerRef.current.getBoundingClientRect()
      setPortalStyle({
        position: "fixed",
        top: r.bottom + 4,
        left: r.left,
        width: r.width,
        zIndex: 99999,
      })
    }
    setOpen(true)
  }, [])

  const closeDropdown = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const onMouseDown = (e: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        closeDropdown()
      }
    }
    document.addEventListener("mousedown", onMouseDown)
    return () => document.removeEventListener("mousedown", onMouseDown)
  }, [open, closeDropdown])

  const toggleItem = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id])
  }

  const getLabel = (id: string) => {
    const item = options.find((m) => String(m.m_id ?? m.id) === id)
    return item?.m_title ?? item?.title ?? id
  }

  return (
    <div className="relative">
      <div
        ref={triggerRef}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        tabIndex={0}
        onClick={() => (open ? closeDropdown() : openDropdown())}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open ? closeDropdown() : openDropdown() }
          if (e.key === "Escape") closeDropdown()
        }}
        className={[
          "min-h-[40px] px-3 py-1.5 w-full border-2 rounded-md",
          "flex flex-wrap gap-1.5 items-center cursor-pointer",
          "bg-white outline-none transition-all duration-200",
          "focus-visible:ring-2 focus-visible:ring-[#32a7de]",
          hasError ? "border-[#bd222f]" : open ? "border-[#32a7de] shadow-sm" : "border-border hover:border-[#32a7de]/50",
        ].join(" ")}
      >
        <Utensils className="h-4 w-4 mr-1 text-muted-foreground shrink-0 pointer-events-none" />
        {selected.length === 0 ? (
          <span className="text-muted-foreground text-sm pl-1 select-none flex-1">Select your favorites...</span>
        ) : (
          <div className="flex flex-wrap gap-1.5 flex-1">
            {selected.map((id) => (
              <span key={id} className="bg-[#32a7de]/15 text-[#222552] text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1.5">
                {getLabel(id)}
                <button
                  type="button"
                  aria-label={`Remove ${getLabel(id)}`}
                  onMouseDown={(e) => toggleItem(id, e)}
                  className="bg-white hover:bg-[#bd222f] hover:text-white rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        <ChevronDown className={`h-4 w-4 ml-auto shrink-0 text-muted-foreground pointer-events-none transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </div>

      {open && createPortal(
        <div
          role="listbox"
          aria-multiselectable="true"
          style={portalStyle}
          onMouseDown={(e) => e.preventDefault()}
          className="bg-white border border-gray-200 rounded-lg shadow-2xl max-h-56 overflow-y-auto"
        >
          {isLoading ? (
            <div className="p-4 text-center text-sm text-gray-500 flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin text-[#32a7de]" />
              Loading menu options...
            </div>
          ) : hasLoadError ? (
            <div className="p-4 text-center text-sm text-red-500">
              Could not load menu items. Check that your API server is running.
            </div>
          ) : options.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-400">No menu items found.</div>
          ) : (
            <div className="p-1.5 flex flex-col gap-0.5">
              {options.map((item, idx) => {
                const itemId = String(item.m_id ?? item.id ?? `menu-${idx}`)
                const itemTitle = item.m_title ?? item.title ?? `Menu Item ${idx + 1}`
                const isChecked = selected.includes(itemId)
                return (
                  <div
                    key={itemId}
                    role="option"
                    aria-selected={isChecked}
                    onMouseDown={(e) => toggleItem(itemId, e)}
                    className={["flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors select-none", isChecked ? "bg-[#32a7de]/10" : "hover:bg-slate-50"].join(" ")}
                  >
                    <div className={["h-4 w-4 shrink-0 rounded-sm border-2 flex items-center justify-center transition-colors", isChecked ? "bg-[#32a7de] border-[#32a7de]" : "bg-white border-gray-300"].join(" ")}>
                      {isChecked && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                    </div>
                    <span className={`text-sm ${isChecked ? "text-[#32a7de] font-semibold" : "text-[#222552] font-medium"}`}>
                      {itemTitle}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// ToggleCard
// ---------------------------------------------------------------------------
interface ToggleCardProps {
  checked: boolean
  onChange: (next: boolean) => void
  accentColor: string
  icon: React.ReactNode
  label: string
  description: string
}

function ToggleCard({ checked, onChange, accentColor, icon, label, description }: ToggleCardProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="w-full text-left flex items-start gap-3 p-3 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-md outline-none focus-visible:ring-2 focus-visible:ring-offset-1 bg-white"
      style={
        checked
          ? { backgroundColor: `${accentColor}0d`, borderColor: accentColor }
          : { borderColor: "#e2e8f0" }
      }
    >
      <div
        className="mt-0.5 h-5 w-5 shrink-0 rounded-md border-2 flex items-center justify-center transition-all duration-200"
        style={
          checked
            ? { backgroundColor: accentColor, borderColor: accentColor }
            : { backgroundColor: "white", borderColor: "#d1d5db" }
        }
      >
        {checked && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
      </div>
      <div className="space-y-0.5 flex-1">
        <p className="text-sm font-medium text-[#222552] flex items-center gap-2">
          {icon}
          {label}
        </p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </button>
  )
}

// ---------------------------------------------------------------------------
// RegistrationForm
// ---------------------------------------------------------------------------
export function RegistrationForm() {
  const { toast } = useToast()

  const [menuOptions, setMenuOptions] = useState<MenuItem[]>([])
  const [branchOptions, setBranchOptions] = useState<BranchItem[]>([])
  const [menuLoading, setMenuLoading] = useState(true)
  const [menuFetchError, setMenuFetchError] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    tagId: "",
    name: "",
    phoneNumber: "",
    birthday: "",
    favoriteMenuCode: "",
    frequentedBiggsLocationId: "",
    interestedInEvents: false,
    interestedInFranchise: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})

  useEffect(() => {
    // ✅ Calls your local Next.js proxy — no CORS
    fetch(`${API_BASE}/menu_list.php`)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((data) => {
        const list: MenuItem[] = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []
        if (list.length === 0) setMenuFetchError(true)
        setMenuOptions(list)
      })
      .catch(() => setMenuFetchError(true))
      .finally(() => setMenuLoading(false))

    fetch(`${API_BASE}/branches.php`)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json() })
      .then((data) => {
        const list: BranchItem[] = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : []
        setBranchOptions(list)
      })
      .catch(() => console.error("Could not fetch branches"))
  }, [])

  const setField = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => { if (!prev[key]) return prev; const next = { ...prev }; delete next[key]; return next })
  }, [])

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormData, string>> = {}
    if (!formData.tagId.trim()) e.tagId = "Tag ID is required"
    if (!formData.name.trim()) e.name = "Name is required"
    if (!formData.phoneNumber.trim()) { e.phoneNumber = "Phone number is required" }
    else if (!/^[\d\s\-+()]{10,15}$/.test(formData.phoneNumber.replace(/\s/g, ""))) { e.phoneNumber = "Please enter a valid phone number" }
    if (!formData.birthday) e.birthday = "Birthday is required"
    if (!formData.favoriteMenuCode) e.favoriteMenuCode = "Please select a favorite menu"
    if (!formData.frequentedBiggsLocationId) e.frequentedBiggsLocationId = "Please select a location"
    setErrors(e)
    if (Object.keys(e).length > 0) {
      toast({ variant: "destructive", title: "Oops! Something is missing", description: "Please fill in all required fields correctly." })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    try {
      // ✅ Calls your local Next.js proxy — no CORS
      const res = await fetch(`${API_BASE}/register.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tag_id: formData.tagId,
          name: formData.name,
          phone_number: formData.phoneNumber,
          birthday: formData.birthday,
          favorite_menu_code: formData.favoriteMenuCode,
          frequented_biggs_location_id: Number(formData.frequentedBiggsLocationId),
          interested_in_events: Boolean(formData.interestedInEvents),
          interested_in_franchise: Boolean(formData.interestedInFranchise),
        }),
      })
      const result = await res.json()
      if (res.ok && result.success) {
        setIsSuccess(true)
        toast({ title: "Welcome to the Family!", description: "Your registration is complete. Check your phone for a special welcome gift!" })
      } else {
        const errorMsg = (result.error || "").toLowerCase()
        if (errorMsg.includes("duplicate") || errorMsg.includes("already registered") || errorMsg.includes("exists")) {
          setErrors((prev) => ({ ...prev, tagId: "This Tag ID is already registered. Please use a different one." }))
          toast({
            variant: "destructive",
            title: "Tag ID already registered",
            description: "The Tag ID you entered is already in use. Please use a different Tag ID.",
          })
        } else {
          toast({ variant: "destructive", title: "Registration failed", description: result.error || "Please try again." })
        }
      }
    } catch {
      toast({ variant: "destructive", title: "Network error", description: "Could not connect to the server." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setIsSuccess(false)
    setErrors({})
    setFormData({
      tagId: "",
      name: "",
      phoneNumber: "",
      birthday: "",
      favoriteMenuCode: "",
      frequentedBiggsLocationId: "",
      interestedInEvents: false,
      interestedInFranchise: false,
    })
  }

  if (isSuccess) {
    return (
      <div className="w-full animate-scale-up">
        <Card className="w-full max-w-lg mx-auto border-0 shadow-2xl overflow-hidden bg-white">
          <div className="h-2 flex">
            <div className="flex-1 bg-[#32a7de]" /><div className="flex-1 bg-[#e8ba37]" /><div className="flex-1 bg-[#bd222f]" />
          </div>
          <CardContent className="pt-14 pb-14 px-8 text-center">
            <div className="w-24 h-24 rounded-full bg-[#32a7de] flex items-center justify-center mx-auto shadow-xl mb-8">
              <svg viewBox="0 0 24 24" className="w-12 h-12" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-[#222552] mb-3">You&apos;re In!</h2>
            <p className="text-muted-foreground mb-8 text-lg px-4">Welcome to the Biggs family! Get ready for exclusive offers and delicious rewards.</p>
            <Button onClick={handleReset} className="bg-[#222552] hover:bg-[#1a1c40] text-white px-8 h-12 font-semibold text-base">
              Register Another Member
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full animate-slide-in-bottom">
      <Card className="w-full max-w-lg mx-auto border-0 shadow-2xl overflow-hidden bg-white">
        <div className="h-2 flex">
          <div className="flex-1 bg-[#32a7de]" /><div className="flex-1 bg-[#e8ba37]" /><div className="flex-1 bg-[#bd222f]" />
        </div>

        <CardHeader className="space-y-0.5 pb-2 pt-3 px-4 sm:pb-3 sm:pt-5 sm:px-5">
          <div className="flex items-center justify-center">
            <div className="relative w-28 h-28 sm:w-32 sm:h-32">
              <img src="/front.svg" alt="Biggs Logo" className="w-full h-full object-contain" />
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-center text-[#222552]">Join Biggs Family</CardTitle>
          <CardDescription className="text-center text-muted-foreground text-sm">Register now and get exclusive member benefits</CardDescription>
        </CardHeader>

        <CardContent className="px-4 pb-4 sm:px-5 sm:pb-6">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Tag ID */}
            <div className="space-y-1">
              <Label htmlFor="tagId" className="text-sm font-medium text-[#222552]">Tag ID <span className="text-[#bd222f]">*</span></Label>
              <div className="relative group">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-[#32a7de]" />
                <Input
                  id="tagId" placeholder="Enter your tag ID" value={formData.tagId}
                  onChange={(e) => setField("tagId", e.target.value)}
                  className={`pl-10 h-10 border-2 transition-all duration-300 focus:border-[#32a7de] text-[#222552] bg-white ${errors.tagId ? "border-[#bd222f]" : "border-border hover:border-[#32a7de]/50"}`}
                />
              </div>
              {errors.tagId && <p className="text-xs text-[#bd222f]">{errors.tagId}</p>}
            </div>

            {/* Name */}
            <div className="space-y-1">
              <Label htmlFor="name" className="text-sm font-medium text-[#222552]">Full Name <span className="text-[#bd222f]">*</span></Label>
              <div className="relative group">
                <Input
                  id="name" placeholder="Enter your full name" value={formData.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className={`h-10 border-2 transition-all duration-300 focus:border-[#32a7de] text-[#222552] bg-white ${errors.name ? "border-[#bd222f]" : "border-border hover:border-[#32a7de]/50"}`}
                />
              </div>
              {errors.name && <p className="text-xs text-[#bd222f]">{errors.name}</p>}
            </div>

            {/* Phone & Birthday */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-[#222552]">Phone <span className="text-[#bd222f]">*</span></Label>
                <div className="relative group">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-[#32a7de]" />
                  <Input
                    id="phoneNumber" type="tel" placeholder="+63 912 345 6789" value={formData.phoneNumber}
                    onChange={(e) => setField("phoneNumber", e.target.value)}
                    className={`pl-10 h-10 border-2 transition-all duration-300 focus:border-[#32a7de] text-[#222552] bg-white ${errors.phoneNumber ? "border-[#bd222f]" : "border-border hover:border-[#32a7de]/50"}`}
                  />
                </div>
                {errors.phoneNumber && <p className="text-xs text-[#bd222f]">{errors.phoneNumber}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="birthday" className="text-sm font-medium text-[#222552]">Birthday <span className="text-[#bd222f]">*</span></Label>
                <div className="relative group">
                  <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-[#32a7de]" />
                  <Input
                    id="birthday" type="date" value={formData.birthday}
                    onChange={(e) => setField("birthday", e.target.value)}
                    className={`pl-10 h-10 border-2 transition-all duration-300 focus:border-[#32a7de] text-[#222552] bg-white ${errors.birthday ? "border-[#bd222f]" : "border-border hover:border-[#32a7de]/50"}`}
                  />
                </div>
                {errors.birthday && <p className="text-xs text-[#bd222f]">{errors.birthday}</p>}
              </div>
            </div>

            {/* Favorite Menu Code */}
            <div className="space-y-1">
              <Label className="text-sm font-medium text-[#222552]">Favorite Menu <span className="text-[#bd222f]">*</span></Label>
              <div className="relative group">
                <Utensils className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                <Select value={formData.favoriteMenuCode || undefined} onValueChange={(val) => setField("favoriteMenuCode", val)}>
                  <SelectTrigger className={`pl-10 h-10 w-full border-2 transition-all duration-300 focus:border-[#32a7de] text-[#222552] bg-white ${errors.favoriteMenuCode ? "border-[#bd222f]" : "border-border hover:border-[#32a7de]/50"}`}>
                    <SelectValue placeholder="Select favorite menu" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuLoading ? (
                      <SelectItem value="__loading__" disabled>Loading menu items…</SelectItem>
                    ) : menuFetchError ? (
                      <SelectItem value="__error__" disabled>Could not load menu items</SelectItem>
                    ) : menuOptions.length === 0 ? (
                      <SelectItem value="__empty__" disabled>No menu items found</SelectItem>
                    ) : (
                      menuOptions.map((item, idx) => {
                        const menuCode = String(item.m_code ?? item.m_id ?? item.id ?? `menu-${idx}`)
                        const menuTitle = item.m_title ?? item.title ?? `Menu Item ${idx + 1}`
                        return <SelectItem key={menuCode} value={menuCode} className="cursor-pointer text-[#222552]">{menuTitle}</SelectItem>
                      })
                    )}
                  </SelectContent>
                </Select>
              </div>
              {errors.favoriteMenuCode && <p className="text-xs text-[#bd222f]">{errors.favoriteMenuCode}</p>}
            </div>

            {/* Frequented Biggs Location */}
            <div className="space-y-1">
              <Label className="text-sm font-medium text-[#222552]">Frequented Bigg&apos;s Location <span className="text-[#bd222f]">*</span></Label>
              <div className="relative group">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10 pointer-events-none" />
                <Select value={formData.frequentedBiggsLocationId || undefined} onValueChange={(val) => setField("frequentedBiggsLocationId", val)}>
                  <SelectTrigger className={`pl-10 h-10 w-full border-2 transition-all duration-300 focus:border-[#32a7de] text-[#222552] bg-white ${errors.frequentedBiggsLocationId ? "border-[#bd222f]" : "border-border hover:border-[#32a7de]/50"}`}>
                    <SelectValue placeholder="Select preferred location" />
                  </SelectTrigger>
                  <SelectContent>
                    {branchOptions.length === 0 ? (
                      <SelectItem value="__loading__" disabled>Loading locations…</SelectItem>
                    ) : (
                      branchOptions.map((branch, idx) => {
                        const branchId = String(branch.id ?? branch.branch_id ?? branch.b_id ?? `branch-${idx}`)
                        const branchTitle = branch.title ?? branch.branch_name ?? `Branch ${idx + 1}`
                        return <SelectItem key={branchId} value={branchId} className="cursor-pointer text-[#222552]">{branchTitle}</SelectItem>
                      })
                    )}
                  </SelectContent>
                </Select>
              </div>
              {errors.frequentedBiggsLocationId && <p className="text-xs text-[#bd222f]">{errors.frequentedBiggsLocationId}</p>}
            </div>

            {/* Interest Toggles */}
            <div className="space-y-2 pt-1">
              <ToggleCard
                checked={formData.interestedInEvents}
                onChange={(val) => setField("interestedInEvents", val)}
                accentColor="#32a7de"
                icon={<PartyPopper className="h-4 w-4" style={{ color: formData.interestedInEvents ? "#32a7de" : "#e8ba37" }} />}
                label="Interested in Events"
                description="Get notified about exclusive events and special promotions"
              />
              <ToggleCard
                checked={formData.interestedInFranchise}
                onChange={(val) => setField("interestedInFranchise", val)}
                accentColor="#e8ba37"
                icon={<Building2 className="h-4 w-4" style={{ color: formData.interestedInFranchise ? "#e8ba37" : "#bd222f" }} />}
                label="Interested in Franchise"
                description="Learn about franchise and partnership opportunities"
              />
            </div>

            {/* Submit */}
            <div className="pt-3">
              <Button
                type="submit" disabled={isSubmitting}
                className="w-full h-11 sm:h-12 bg-[#222552] hover:bg-[#1a1c40] text-white font-semibold text-base transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                {isSubmitting
                  ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                  : <><CheckCircle2 className="mr-2 h-5 w-5" /> Complete Registration</>
                }
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  )
}