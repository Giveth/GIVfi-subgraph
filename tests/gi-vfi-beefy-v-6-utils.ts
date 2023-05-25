import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  Approval,
  FeeRecipientSet,
  FeeSet,
  FeesPaid,
  Initialized,
  Transfer
} from "../generated/GIVfiBeefyV6/GIVfiBeefyV6"

export function createApprovalEvent(
  owner: Address,
  spender: Address,
  value: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("spender", ethereum.Value.fromAddress(spender))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return approvalEvent
}

export function createFeeRecipientSetEvent(
  feeRecipient: Address
): FeeRecipientSet {
  let feeRecipientSetEvent = changetype<FeeRecipientSet>(newMockEvent())

  feeRecipientSetEvent.parameters = new Array()

  feeRecipientSetEvent.parameters.push(
    new ethereum.EventParam(
      "feeRecipient",
      ethereum.Value.fromAddress(feeRecipient)
    )
  )

  return feeRecipientSetEvent
}

export function createFeeSetEvent(fee: BigInt): FeeSet {
  let feeSetEvent = changetype<FeeSet>(newMockEvent())

  feeSetEvent.parameters = new Array()

  feeSetEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )

  return feeSetEvent
}

export function createFeesPaidEvent(
  user: Address,
  recipient: Address,
  shares: BigInt,
  amount: BigInt
): FeesPaid {
  let feesPaidEvent = changetype<FeesPaid>(newMockEvent())

  feesPaidEvent.parameters = new Array()

  feesPaidEvent.parameters.push(
    new ethereum.EventParam("user", ethereum.Value.fromAddress(user))
  )
  feesPaidEvent.parameters.push(
    new ethereum.EventParam("recipient", ethereum.Value.fromAddress(recipient))
  )
  feesPaidEvent.parameters.push(
    new ethereum.EventParam("shares", ethereum.Value.fromUnsignedBigInt(shares))
  )
  feesPaidEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return feesPaidEvent
}

export function createInitializedEvent(version: i32): Initialized {
  let initializedEvent = changetype<Initialized>(newMockEvent())

  initializedEvent.parameters = new Array()

  initializedEvent.parameters.push(
    new ethereum.EventParam(
      "version",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(version))
    )
  )

  return initializedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  value: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return transferEvent
}
