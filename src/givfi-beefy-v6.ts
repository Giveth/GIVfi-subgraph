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
  Approval,
  FeeRecipientSet,
  FeeSet,
  FeesPaid,
  Initialized,
  Transfer,
} from '../generated/schema';

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.owner = event.params.owner;
  entity.spender = event.params.spender;
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
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
}

export function handleInitialized(event: InitializedEvent): void {
  let entity = new Initialized(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.version = event.params.version;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTransfer(event: TransferEvent): void {
  let accountId = event.params.to.toHex();
  let account = Account.load(accountId);
  if (account == null) {
    account = new Account(accountId);
    account.save();
  }

  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.value = event.params.value;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();

  let balanceId = 'GIVFiVault-' + account.id;
  let balance = Balance.load(balanceId);
  if (balance == null) {
    balance = new Balance(balanceId);
    balance.account = account.id;
    balance.value = BigInt.fromI32(0);
  }
  balance.value = balance.value.plus(event.params.value);
  balance.timestamp = event.block.timestamp;
  balance.save();
}
