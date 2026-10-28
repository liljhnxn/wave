# Wave 👋 — A Simple Web3 Social DApp

> **Tagline:** Drop a wave. Get one back. 👋

**Wave** is a minimal, focused Web3 social application built on **Botchain Testnet**. Users connect their MetaMask wallet, send an on-chain wave to any recipient address, and view recent waves recorded directly on the blockchain.

---

## ⚡ Features

- **Connect Wallet:** Seamless MetaMask connection with shortened address display, connection status, network detection, and graceful disconnection.
- **Botchain Testnet Native:** Configured for Botchain Testnet (Chain ID `968`). Includes a one-click network switch / network addition prompt.
- **👋 Send a Wave:** Send an on-chain wave transaction to any recipient address with validation (preventing zero addresses or self-waves), real-time pending states, and explorer links upon confirmation.
- **Activity Feed:** Live list of recent waves showing sender, recipient, timestamp, and links to Botchain Explorer.
- **Live Statistics:** Total wave count, waves sent, and waves received by the connected wallet directly queried from the smart contract.
- **Charcoal & Muted Purple Aesthetics:** Dark charcoal UI, muted purple accents, emerald success indicators, and subtle micro-animations.

---

## 🛠️ Technology Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React 18, TypeScript)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Blockchain Client:** [wagmi v2](https://wagmi.sh/) & [viem](https://viem.sh/)
- **Smart Contract Development:** [Hardhat](https://hardhat.org/) & [Solidity 0.8.20](https://soliditylang.org/)
- **Testing:** Mocha, Chai, `@nomicfoundation/hardhat-toolbox`
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 🌐 Network Configuration (Botchain Testnet)

| Parameter | Value |
|---|---|
| **Network Name** | Botchain Testnet |
| **Chain ID** | `968` (`0x3c8`) |
| **Currency Symbol** | `tBOT` |
| **Decimals** | `18` |
| **RPC URL** | `https://rpc.bohr.life` |
| **Block Explorer** | `https://scan.bohr.life` |

---

## 📁 Project Structure

```
├── contracts/
│   └── Wave.sol                # Solidity smart contract (waves, counters, events)
├── scripts/
│   └── deploy.ts               # Hardhat deployment script for Botchain Testnet
├── test/
│   └── Wave.test.ts            # Contract unit tests (events, reverts, counters)
├── src/
│   ├── app/
│   │   ├── globals.css         # Charcoal dark theme & animations
│   │   ├── layout.tsx          # App layout with Inter font & SEO tags
│   │   ├── page.tsx            # Single-page interface
│   │   └── providers.tsx       # Wagmi & React Query providers
│   ├── components/
│   │   ├── Header.tsx          # Brand, network status, MetaMask connect
│   │   ├── Hero.tsx            # Heading, subtitle, animated wave icon
│   │   ├── StatsBar.tsx        # Total waves, waves sent, waves received
│   │   ├── WaveActionCard.tsx  # Wave submission card with validation & confirmation
│   │   ├── RecentWaves.tsx     # Activity feed of recent waves
│   │   ├── ContractNotice.tsx  # Clear setup guide if contract is unconfigured
│   │   └── Footer.tsx          # Brand, testnet info, and disclaimer
│   └── config/
│       ├── chain.ts            # Botchain Testnet viem chain definition
│       ├── contract.ts         # Wave contract ABI, address, and helpers
│       └── wagmi.ts            # Wagmi client configuration
├── hardhat.config.ts           # Hardhat configuration with Botchain network
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Compile and Test Smart Contract

Compile the Solidity contract:
```bash
npx hardhat compile
```

Run the automated contract unit tests:
```bash
npx hardhat test
```

### 3. Deploy Contract to Botchain Testnet

To deploy the contract to Botchain Testnet:

1. Obtain testnet `tBOT` from the Botchain Testnet faucet for your deployer address.
2. Create or open `.env` in the root directory and add your deployer private key (excluded from git):
   ```env
   PRIVATE_KEY=your_private_key_here
   ```
3. Run the deployment script:
   ```bash
   npx hardhat run scripts/deploy.ts --network botchain
   ```
4. Copy the deployed contract address output by the script.

### 4. Configure Frontend Environment

Create a `.env.local` file (or copy `.env.example`):
```bash
cp .env.example .env.local
```

Set the deployed contract address:
```env
NEXT_PUBLIC_WAVE_CONTRACT_ADDRESS=0xYourDeployedContractAddressHere
```

### 5. Run the Local Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Build for Production

```bash
npm run build
npm run start
```

---

## ⛽ Gas & Testnet Details

- **Viewing waves & stats:** **Free (No gas required)**. Reading total wave count, recent waves, or individual stats are `view` calls executed directly against the Botchain RPC.
- **Deploying the contract:** **Requires testnet gas (`tBOT`)** on Botchain Testnet.
- **Sending a wave:** **Requires testnet gas (`tBOT`)** for the transaction fee paid by the sender's MetaMask wallet.

---

## 📄 License

MIT
