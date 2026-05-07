;; ContentHub Contract
;; A decentralized platform for creators to showcase their content and monetize it.
;; Features: Content registration, STX payments for unlocking, and on-chain verification.

;; --- Constants ---
(define-constant CONTRACT-OWNER tx-sender)
(define-constant ERR-NOT-AUTHORIZED (err u100))
(define-constant ERR-ALREADY-REGISTERED (err u101))
(define-constant ERR-NOT-FOUND (err u102))
(define-constant ERR-INSUFFICIENT-FUNDS (err u103))

;; --- Data Maps ---

;; Content metadata
(define-map content-metadata
  principal
  {
    title: (string-ascii 64),
    description: (string-utf8 256),
    category: (string-ascii 32),
    price: uint, ;; Price in microSTX to unlock content
    total-unlocks: uint,
    is-active: bool
  }
)

;; Tracking hires (Employer -> Talent -> Count)
(define-map hire-records
  { employer: principal, talent: principal }
  { timestamp: uint, amount: uint }
)

;; --- Read-Only Functions ---

(define-read-only (get-profile (talent principal))
  (map-get? talent-profiles talent)
)

(define-read-only (get-hire-record (employer principal) (talent principal))
  (map-get? hire-records { employer: employer, talent: talent })
)

;; --- Public Functions ---

;; Register or update a talent profile
(define-public (register-profile (name (string-ascii 64)) (bio (string-utf8 256)) (skills (string-ascii 128)) (price uint))
  (begin
    (ok (map-set talent-profiles tx-sender
      {
        name: name,
        bio: bio,
        skills: skills,
        price: price,
        total-hired: (default-to u0 (get total-hired (map-get? talent-profiles tx-sender))),
        is-active: true
      }
    ))
  )
)

;; Hire a talent by paying their specified price
(define-public (hire-talent (talent principal))
  (let
    (
      (profile (unwrap! (map-get? talent-profiles talent) ERR-NOT-FOUND))
      (price (get price profile))
      (total-hired (get total-hired profile))
    )
    (begin
      ;; 1. Transfer STX from employer (tx-sender) to talent
      (try! (stx-transfer? price tx-sender talent))
      
      ;; 2. Record the hire
      (map-set hire-records { employer: tx-sender, talent: talent } 
        { timestamp: block-height, amount: price }
      )
      
      ;; 3. Increment hire count
      (map-set talent-profiles talent
        (merge profile { total-hired: (+ total-hired u1) })
      )
      
      (print { event: "talent-hired", employer: tx-sender, talent: talent, amount: price })
      (ok true)
    )
  )
)

;; Toggle profile visibility
(define-public (set-active (active bool))
  (let
    (
      (profile (unwrap! (map-get? talent-profiles tx-sender) ERR-NOT-FOUND))
    )
    (ok (map-set talent-profiles tx-sender
      (merge profile { is-active: active })
    ))
  )
)
