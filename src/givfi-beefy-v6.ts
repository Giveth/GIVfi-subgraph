import { BigInt } from '@graphprotocol/graph-ts';
import {
  Approval as ApprovalEvent,
  FeeRecipientSet as FeeRecipientSetEvent,
  FeeSet as FeeSetEvent,
  FeesPaid as FeesPaidEvent,
  Initialized as InitializedEvent,
  Transfer as TransferEvent,
} from '../generated/GIVfiBeefyV6/GIVfiBeefyV6';
import {
  Account,
  Balance,
  FeeRecipientSet,
  FeeSet,
  FeesPaid,
  Transfer,
} from '../generated/schema';

export function handleApproval(event: ApprovalEvent): void {
  // NOT IMPORTANT
  // let entity = new Approval(
  //   event.transaction.hash.concatI32(event.logIndex.toI32())
  // );
  // entity.owner = event.params.owner;
  // entity.spender = event.params.spender;
  // entity.value = event.params.value;
  // entity.blockNumber = event.block.number;
  // entity.blockTimestamp = event.block.timestamp;
  // entity.transactionHash = event.transaction.hash;
  // entity.save();
}

export function handleFeeRecipientSet(event: FeeRecipientSetEvent): void {
  let entity = new FeeRecipientSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.feeRecipient = event.params.feeRecipient;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleFeeSet(event: FeeSetEvent): void {
  let entity = new FeeSet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.fee = event.params.fee;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleFeesPaid(event: FeesPaidEvent): void {
  let entity = new FeesPaid(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.user = event.params.user;
  entity.recipient = event.params.recipient;
  entity.shares = event.params.shares;
  entity.amount = event.params.amount;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let account = Account.load(event.params.user.toHex());
  if (account != null) {
    // Update rewards for the account
    let rewards = account.rewards || BigInt.fromI32(0);
    account.rewards = rewards.plus(event.params.amount);
    account.save();
  }
}

export function handleInitialized(event: InitializedEvent): void {
  // NOT IMPORTANT
  // let entity = new Initialized(
  //   event.transaction.hash.concatI32(event.logIndex.toI32())
  // );
  // entity.version = event.params.version;
  // entity.blockNumber = event.block.number;
  // entity.blockTimestamp = event.block.timestamp;
  // entity.transactionHash = event.transaction.hash;
  // entity.save();
}

export function handleTransfer(event: TransferEvent): void {
  let recipientAddressHex = event.params.to.toHex();
  let vault = Account.load(recipientAddressHex);
  if (vault == null) {
    vault = new Account(recipientAddressHex);
    vault.rewards = BigInt.fromI32(0);
    vault.save();
  }

  let senderAddressHex = event.params.from.toHex();
  let staker = Account.load(senderAddressHex);
  if (
    staker == null &&
    senderAddressHex != '0x0000000000000000000000000000000000000000'
  ) {
    staker = new Account(senderAddressHex);
    staker.rewards = BigInt.fromI32(0);
    staker.save();
  }

  let transferRecord = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  transferRecord.from = event.params.from;
  transferRecord.to = event.params.to;
  transferRecord.value = event.params.value;
  transferRecord.blockNumber = event.block.number;
  transferRecord.blockTimestamp = event.block.timestamp;
  transferRecord.transactionHash = event.transaction.hash;
  transferRecord.save();

  let vaultBalanceID = recipientAddressHex;
  let vaultBalance = Balance.load(vaultBalanceID);
  if (vaultBalance == null) {
    vaultBalance = new Balance(vaultBalanceID);
    vaultBalance.account = vault.id;
    vaultBalance.value = BigInt.fromI32(0);
    vaultBalance.timestamp = event.block.timestamp;
  }

  vaultBalance.value = vaultBalance.value.plus(event.params.value);
  vaultBalance.save();

  if (
    senderAddressHex != '0x0000000000000000000000000000000000000000' &&
    staker != null
  ) {
    let stakerBalanceID = senderAddressHex;
    let stakerBalance = Balance.load(stakerBalanceID);
    if (stakerBalance == null) {
      stakerBalance = new Balance(stakerBalanceID);
      stakerBalance.account = staker.id;
      stakerBalance.value = BigInt.fromI32(0);
      stakerBalance.timestamp = event.block.timestamp;
    }

    stakerBalance.value = stakerBalance.value.minus(event.params.value);
    stakerBalance.save();
  }
}
