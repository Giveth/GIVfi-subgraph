import { BigInt } from '@graphprotocol/graph-ts';
import {
  Approval as ApprovalEvent,
  FeeRecipientSet as FeeRecipientSetEvent,
  FeeSet as FeeSetEvent,
  FeesPaid as FeesPaidEvent,
  Initialized as InitializedEvent,
  Transfer as TransferEvent,
  Deposited as DepositedEvent,
  Withdrawn as WithdrawnEvent,
} from '../generated/GIVfiBeefyV6/GIVfiBeefyV6';
import {
  Account,
  FeeRecipientSet,
  FeeSet,
  FeesPaid,
  Deposit,
  Withdraw,
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

function loadOrCreateAccount(address: string, timestamp: BigInt): Account {
  let account = Account.load(address);
  if (account == null) {
    account = new Account(address);
    account.rewards = BigInt.fromI32(0);
    account.createdAt = timestamp;
    account.lastUpdated = timestamp;
  }
  return account as Account;
}

export function handleTransfer(event: TransferEvent): void {
  let fromAccount = loadOrCreateAccount(
    event.params.from.toHex(),
    event.block.timestamp
  );
  fromAccount.lastUpdated = event.block.timestamp;
  fromAccount.save();

  let toAccount = loadOrCreateAccount(
    event.params.to.toHex(),
    event.block.timestamp
  );
  toAccount.lastUpdated = event.block.timestamp;
  toAccount.save();
}

function createDeposit(
  accountId: string,
  amount: BigInt,
  timestamp: BigInt
): void {
  let depositId = accountId.concat('-').concat(timestamp.toString());
  let deposit = new Deposit(depositId);
  deposit.account = accountId;
  deposit.amount = amount;
  deposit.timestamp = timestamp;
  deposit.save();
}

function createWithdraw(
  accountId: string,
  amount: BigInt,
  timestamp: BigInt
): void {
  let withdrawId = accountId.concat('-').concat(timestamp.toString());
  let withdraw = new Withdraw(withdrawId);
  withdraw.account = accountId;
  withdraw.amount = amount;
  withdraw.timestamp = timestamp;
  withdraw.save();
}

export function handleDeposited(event: DepositedEvent): void {
  let account = loadOrCreateAccount(
    event.params.user.toHex(),
    event.block.timestamp
  );
  account.lastUpdated = event.block.timestamp;
  account.save();

  createDeposit(account.id, event.params.amount, event.block.timestamp);
}

export function handleWithdrawn(event: WithdrawnEvent): void {
  let account = loadOrCreateAccount(
    event.params.user.toHex(),
    event.block.timestamp
  );
  account.lastUpdated = event.block.timestamp;
  account.save();

  createWithdraw(account.id, event.params.amount, event.block.timestamp);
}
