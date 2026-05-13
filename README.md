# Paytw 💸
### Pay Through Web

A web-based payment platform for seamless digital transactions.

---

## Overview

Paytw is a web application that enables users to send and receive payments digitally. It is designed with reliability and precision at its core — including careful handling of monetary values to avoid common floating-point pitfalls.

---

## Data Storage

### User Personal Information

Each user account stores the following:

| Field | Description |
|---|---|
| `username` | Unique identifier for the user |
| `name` | Full display name |
| `contact` | Phone number or email for communication |

### Monetary Amounts

> **Important:** All amounts are stored as **integers**, not floats.

Floating-point numbers are notoriously imprecise for currency. For example, `0.1 + 0.2` in most languages does not equal `0.3` exactly. To avoid such bugs:

- Amounts are stored in the **smallest currency unit** (paise for INR).
- To convert: multiply the rupee value by 100 before storing.

**Example:**

```
User balance: ₹88.88
Stored in DB:  8888
```

To display the value, divide by 100:

```
8888 / 100 = ₹88.88
```

This approach ensures accuracy across all arithmetic operations on balances.

---

## Getting Started

> *(Add setup/installation steps here)*

```bash
# Clone the repository
git clone https://github.com/your-org/paytw.git

# Install dependencies
cd paytw
npm install

# Start the development server
npm run dev
```

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you'd like to change.

---

## License

[MIT](LICENSE)
