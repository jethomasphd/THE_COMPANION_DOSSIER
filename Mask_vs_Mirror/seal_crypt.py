#!/usr/bin/env python3
"""
seal_crypt.py — Hash-seal and AES-256-GCM encrypt a file for safe storage
                in a (potentially public) Git repository.

Workflow
--------
  ENCRYPT (you, once):
      python seal_crypt.py encrypt  THE_HISTORIAN_S_CONTRIB.docx
        -> writes  THE_HISTORIAN_S_CONTRIB.docx.enc   (commit THIS to the repo)
        -> prints  the 256-bit key                    (keep SECRET, never commit)
        -> prints  SHA-256 of the plaintext           (the "seal" / fingerprint)
        -> prints  SHA-256 of the ciphertext          (verifies the uploaded blob)

  DECRYPT (you or a collaborator, later):
      python seal_crypt.py decrypt  THE_HISTORIAN_S_CONTRIB.docx.enc  --key <HEX_KEY>
        -> writes  THE_HISTORIAN_S_CONTRIB.docx        (round-trips byte-for-byte)

Security model
--------------
  * AES-256 in GCM mode = confidentiality + integrity (tamper-evident).
  * A fresh random 256-bit key AND a fresh random 96-bit nonce are generated
    per encryption, so there is no nonce-reuse risk.
  * The encrypted file is self-describing: [12-byte nonce][ciphertext + 16-byte tag].
  * The KEY is the only secret. The SHA-256 hash is NOT a key and cannot decrypt
    anything — it is a one-way fingerprint used only to prove integrity.

Dependency:  pip install cryptography
"""

from __future__ import annotations

import argparse
import hashlib
import os
import secrets
import sys
from pathlib import Path

from cryptography.hazmat.primitives.ciphers.aead import AESGCM

NONCE_BYTES = 12   # 96-bit nonce — the standard/recommended size for AES-GCM
KEY_BYTES = 32     # 256-bit key


def sha256_hex(data: bytes) -> str:
    """Return the SHA-256 hex digest of `data` (the integrity 'seal')."""
    return hashlib.sha256(data).hexdigest()


def encrypt_file(in_path: Path) -> None:
    """Encrypt `in_path` -> `in_path`.enc and print the key + fingerprints."""
    plaintext = in_path.read_bytes()
    print(f"[*] Read {len(plaintext):,} bytes from {in_path.name}")

    key = secrets.token_bytes(KEY_BYTES)                      # 256-bit secret, CSPRNG
    nonce = os.urandom(NONCE_BYTES)                           # unique per message
    ciphertext = AESGCM(key).encrypt(nonce, plaintext, None)  # auth tag appended

    blob = nonce + ciphertext                                 # self-describing container
    out_path = in_path.with_suffix(in_path.suffix + ".enc")
    out_path.write_bytes(blob)
    print(f"[*] Wrote {len(blob):,} bytes to {out_path.name}")

    print("\n" + "=" * 70)
    print("ENCRYPTION KEY (hex) — STORE SECRETLY, NEVER COMMIT TO THE REPO:")
    print(f"  {key.hex()}")
    print("-" * 70)
    print(f"SHA-256 of plaintext  ({in_path.name}):")
    print(f"  {sha256_hex(plaintext)}")
    print(f"SHA-256 of ciphertext ({out_path.name}):")
    print(f"  {sha256_hex(blob)}")
    print("=" * 70)


def decrypt_file(in_path: Path, key_hex: str) -> None:
    """Decrypt `in_path` (.enc) using `key_hex`, restoring the original file."""
    key = bytes.fromhex(key_hex.strip())
    if len(key) != KEY_BYTES:
        sys.exit(f"[!] Key must be {KEY_BYTES} bytes ({KEY_BYTES * 2} hex chars); "
                 f"got {len(key)} bytes.")

    blob = in_path.read_bytes()
    nonce, ciphertext = blob[:NONCE_BYTES], blob[NONCE_BYTES:]
    try:
        plaintext = AESGCM(key).decrypt(nonce, ciphertext, None)
    except Exception:
        sys.exit("[!] Decryption FAILED — wrong key or the file was tampered with.")

    # Strip the trailing ".enc" to recover the original filename.
    out_path = (in_path.with_suffix("") if in_path.suffix == ".enc"
                else in_path.with_name(in_path.name + ".dec"))
    out_path.write_bytes(plaintext)
    print(f"[*] Decrypted -> {out_path.name} ({len(plaintext):,} bytes)")
    print(f"[*] SHA-256 of recovered plaintext: {sha256_hex(plaintext)}")
    print("    (Compare against the plaintext fingerprint from encryption time.)")


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Hash-seal + AES-256-GCM encrypt/decrypt a file.")
    sub = parser.add_subparsers(dest="cmd", required=True)

    enc = sub.add_parser("encrypt", help="Encrypt a file and emit the key + hashes.")
    enc.add_argument("file", type=Path)

    dec = sub.add_parser("decrypt", help="Decrypt a .enc file with --key.")
    dec.add_argument("file", type=Path)
    dec.add_argument("--key", required=True, help="256-bit key as 64 hex characters.")

    args = parser.parse_args()
    if args.cmd == "encrypt":
        encrypt_file(args.file)
    elif args.cmd == "decrypt":
        decrypt_file(args.file, args.key)


if __name__ == "__main__":
    main()
