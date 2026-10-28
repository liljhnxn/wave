import { expect } from "chai";
import hre from "hardhat";
import { Wave } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

const { ethers } = hre;

describe("Wave Smart Contract", function () {
  let waveContract: Wave;
  let owner: HardhatEthersSigner;
  let alice: HardhatEthersSigner;
  let bob: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, alice, bob] = await ethers.getSigners();
    const WaveFactory = await ethers.getContractFactory("Wave");
    waveContract = (await WaveFactory.deploy()) as unknown as Wave;
    await waveContract.waitForDeployment();
  });

  it("should initialize with zero total waves", async function () {
    const total = await waveContract.getTotalWaves();
    expect(total).to.equal(0n);
  });

  it("should send a valid wave, emit WaveSent event, and increment wave count", async function () {
    const tx = await waveContract.connect(alice).sendWave(bob.address);
    const receipt = await tx.wait();
    expect(receipt).to.not.be.null;

    // Check total count
    const total = await waveContract.getTotalWaves();
    expect(total).to.equal(1n);

    // Check sender and recipient counts
    expect(await waveContract.wavesSent(alice.address)).to.equal(1n);
    expect(await waveContract.wavesReceived(bob.address)).to.equal(1n);

    // Verify event
    await expect(waveContract.connect(alice).sendWave(bob.address))
      .to.emit(waveContract, "WaveSent")
      .withArgs(alice.address, bob.address, (val: any) => typeof val === "bigint" && val > 0n);
  });

  it("should reject sending a wave to the zero address", async function () {
    await expect(
      waveContract.connect(alice).sendWave(ethers.ZeroAddress)
    ).to.be.revertedWithCustomError(waveContract, "ZeroAddressNotAllowed");
  });

  it("should reject sending a wave to oneself", async function () {
    await expect(
      waveContract.connect(alice).sendWave(alice.address)
    ).to.be.revertedWithCustomError(waveContract, "CannotWaveToSelf");
  });

  it("should return waves in reverse chronological order via getRecentWaves", async function () {
    await waveContract.connect(alice).sendWave(bob.address);
    await waveContract.connect(bob).sendWave(alice.address);
    await waveContract.connect(owner).sendWave(alice.address);

    const recent = await waveContract.getRecentWaves(10, 0);
    expect(recent.length).to.equal(3);

    // Latest is owner -> alice
    expect(recent[0].sender).to.equal(owner.address);
    expect(recent[0].recipient).to.equal(alice.address);

    // Second is bob -> alice
    expect(recent[1].sender).to.equal(bob.address);
    expect(recent[1].recipient).to.equal(alice.address);

    // Third is alice -> bob
    expect(recent[2].sender).to.equal(alice.address);
    expect(recent[2].recipient).to.equal(bob.address);
  });
});
