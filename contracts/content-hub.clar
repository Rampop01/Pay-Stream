;; @version 3
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
    title: (string-utf8 64),
    description: (string-utf8 256),
    category: (string-utf8 32),
    price: uint, ;; Price in microSTX to unlock content
    total-unlocks: uint,
    is-active: bool
  }
)

;; Tracking unlocks (Buyer -> Creator -> Count)
(define-map unlock-records
  { buyer: principal, creator: principal }
  { timestamp: uint, amount: uint }
)

;; --- Read-Only Functions ---

(define-read-only (get-content-metadata (creator principal))
  (map-get? content-metadata creator)
)

(define-read-only (get-unlock-record (buyer principal) (creator principal))
  (map-get? unlock-records { buyer: buyer, creator: creator })
)

;; Register or update content metadata
(define-public (register-content (title (string-utf8 64)) (description (string-utf8 256)) (category (string-utf8 32)) (price uint))
  (begin
    (ok (map-set content-metadata tx-sender
      {
        title: title,
        description: description,
        category: category,
        price: price,
        total-unlocks: (default-to u0 (get total-unlocks (map-get? content-metadata tx-sender))),
        is-active: true
      }
    ))
  )
)

;; Unlock content by paying specified price
(define-public (unlock-content (creator principal))
  (let
    (
      (metadata (unwrap! (map-get? content-metadata creator) ERR-NOT-FOUND))
      (price (get price metadata))
      (total-unlocks (get total-unlocks metadata))
    )
    (begin
      ;; 1. Transfer STX from buyer (tx-sender) to creator
      (try! (stx-transfer? price tx-sender creator))
      
      ;; 2. Record the unlock
      (map-set unlock-records { buyer: tx-sender, creator: creator } 
        { timestamp: stacks-block-height, amount: price }
      )
      
      ;; 3. Increment unlock count
      (map-set content-metadata creator
        (merge metadata { total-unlocks: (+ total-unlocks u1) })
      )
      
      (print { event: "content-unlocked", buyer: tx-sender, creator: creator, amount: price })
      (ok true)
    )
  )
)

;; Toggle content visibility
(define-public (set-active (active bool))
  (let
    (
      (metadata (unwrap! (map-get? content-metadata tx-sender) ERR-NOT-FOUND))
    )
    (ok (map-set content-metadata tx-sender
      (merge metadata { is-active: active })
    ))
  )
)
