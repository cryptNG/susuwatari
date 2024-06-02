/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "../common";

export type BaggageSlotStruct = {
  susuTokenId: PromiseOrValue<BigNumberish>;
  dropCooldownTime: PromiseOrValue<BigNumberish>;
  ownerAddress: PromiseOrValue<string>;
};

export type BaggageSlotStructOutput = [BigNumber, BigNumber, string] & {
  susuTokenId: BigNumber;
  dropCooldownTime: BigNumber;
  ownerAddress: string;
};

export type UserStateStruct = {
  ownedTokens: PromiseOrValue<BigNumberish>[];
  slot: BaggageSlotStruct;
  team: PromiseOrValue<BigNumberish>;
};

export type UserStateStructOutput = [
  BigNumber[],
  BaggageSlotStructOutput,
  number
] & { ownedTokens: BigNumber[]; slot: BaggageSlotStructOutput; team: number };

export declare namespace LibSusuwatari {
  export type SusuwatariInfoStruct = {
    tokenId: PromiseOrValue<BigNumberish>;
    owner: PromiseOrValue<string>;
    isCarrying: PromiseOrValue<boolean>;
  };

  export type SusuwatariInfoStructOutput = [BigNumber, string, boolean] & {
    tokenId: BigNumber;
    owner: string;
    isCarrying: boolean;
  };

  export type BaggedSusuInfoStruct = {
    tokenId: PromiseOrValue<BigNumberish>;
    carrier: PromiseOrValue<string>;
  };

  export type BaggedSusuInfoStructOutput = [BigNumber, string] & {
    tokenId: BigNumber;
    carrier: string;
  };
}

export interface SusuwatariFacetInterface extends utils.Interface {
  functions: {
    "aimInitialSusu(uint256,uint256,uint256,string)": FunctionFragment;
    "dropSusu(uint256,uint256)": FunctionFragment;
    "getAllSusuwataris()": FunctionFragment;
    "getBaggedSusus()": FunctionFragment;
    "getCurrentState()": FunctionFragment;
    "giveSusuwatari()": FunctionFragment;
    "registerMe(uint8)": FunctionFragment;
    "tryPickupSusu(uint256,uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "aimInitialSusu"
      | "dropSusu"
      | "getAllSusuwataris"
      | "getBaggedSusus"
      | "getCurrentState"
      | "giveSusuwatari"
      | "registerMe"
      | "tryPickupSusu"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "aimInitialSusu",
    values: [
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<string>
    ]
  ): string;
  encodeFunctionData(
    functionFragment: "dropSusu",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getAllSusuwataris",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getBaggedSusus",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getCurrentState",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "giveSusuwatari",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "registerMe",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "tryPickupSusu",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "aimInitialSusu",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "dropSusu", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getAllSusuwataris",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getBaggedSusus",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getCurrentState",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "giveSusuwatari",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "registerMe", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "tryPickupSusu",
    data: BytesLike
  ): Result;

  events: {
    "DroppedSusu(uint256,uint256,uint256,uint256,uint8,string)": EventFragment;
    "MintedSusu(uint256,string,address,uint8)": EventFragment;
    "PickedUpSusu(uint256,uint256,string,address,address,uint8)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "DroppedSusu"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "MintedSusu"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "PickedUpSusu"): EventFragment;
}

export interface DroppedSusuEventObject {
  originLocation: BigNumber;
  currentLocation: BigNumber;
  destination: BigNumber;
  tokenId: BigNumber;
  team: number;
  message: string;
}
export type DroppedSusuEvent = TypedEvent<
  [BigNumber, BigNumber, BigNumber, BigNumber, number, string],
  DroppedSusuEventObject
>;

export type DroppedSusuEventFilter = TypedEventFilter<DroppedSusuEvent>;

export interface MintedSusuEventObject {
  tokenId: BigNumber;
  message: string;
  owner: string;
  team: number;
}
export type MintedSusuEvent = TypedEvent<
  [BigNumber, string, string, number],
  MintedSusuEventObject
>;

export type MintedSusuEventFilter = TypedEventFilter<MintedSusuEvent>;

export interface PickedUpSusuEventObject {
  tokenId: BigNumber;
  location: BigNumber;
  message: string;
  sender: string;
  owner: string;
  team: number;
}
export type PickedUpSusuEvent = TypedEvent<
  [BigNumber, BigNumber, string, string, string, number],
  PickedUpSusuEventObject
>;

export type PickedUpSusuEventFilter = TypedEventFilter<PickedUpSusuEvent>;

export interface SusuwatariFacet extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: SusuwatariFacetInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    aimInitialSusu(
      tokenId: PromiseOrValue<BigNumberish>,
      location: PromiseOrValue<BigNumberish>,
      destination: PromiseOrValue<BigNumberish>,
      message: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    dropSusu(
      tokenId: PromiseOrValue<BigNumberish>,
      location: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    getAllSusuwataris(
      overrides?: CallOverrides
    ): Promise<[LibSusuwatari.SusuwatariInfoStructOutput[]]>;

    getBaggedSusus(
      overrides?: CallOverrides
    ): Promise<[LibSusuwatari.BaggedSusuInfoStructOutput[]]>;

    getCurrentState(
      overrides?: CallOverrides
    ): Promise<[UserStateStructOutput]>;

    giveSusuwatari(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    registerMe(
      team: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    tryPickupSusu(
      tokenId: PromiseOrValue<BigNumberish>,
      location: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  aimInitialSusu(
    tokenId: PromiseOrValue<BigNumberish>,
    location: PromiseOrValue<BigNumberish>,
    destination: PromiseOrValue<BigNumberish>,
    message: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  dropSusu(
    tokenId: PromiseOrValue<BigNumberish>,
    location: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  getAllSusuwataris(
    overrides?: CallOverrides
  ): Promise<LibSusuwatari.SusuwatariInfoStructOutput[]>;

  getBaggedSusus(
    overrides?: CallOverrides
  ): Promise<LibSusuwatari.BaggedSusuInfoStructOutput[]>;

  getCurrentState(overrides?: CallOverrides): Promise<UserStateStructOutput>;

  giveSusuwatari(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  registerMe(
    team: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  tryPickupSusu(
    tokenId: PromiseOrValue<BigNumberish>,
    location: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    aimInitialSusu(
      tokenId: PromiseOrValue<BigNumberish>,
      location: PromiseOrValue<BigNumberish>,
      destination: PromiseOrValue<BigNumberish>,
      message: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    dropSusu(
      tokenId: PromiseOrValue<BigNumberish>,
      location: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    getAllSusuwataris(
      overrides?: CallOverrides
    ): Promise<LibSusuwatari.SusuwatariInfoStructOutput[]>;

    getBaggedSusus(
      overrides?: CallOverrides
    ): Promise<LibSusuwatari.BaggedSusuInfoStructOutput[]>;

    getCurrentState(overrides?: CallOverrides): Promise<UserStateStructOutput>;

    giveSusuwatari(overrides?: CallOverrides): Promise<void>;

    registerMe(
      team: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    tryPickupSusu(
      tokenId: PromiseOrValue<BigNumberish>,
      location: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "DroppedSusu(uint256,uint256,uint256,uint256,uint8,string)"(
      originLocation?: null,
      currentLocation?: null,
      destination?: null,
      tokenId?: null,
      team?: null,
      message?: null
    ): DroppedSusuEventFilter;
    DroppedSusu(
      originLocation?: null,
      currentLocation?: null,
      destination?: null,
      tokenId?: null,
      team?: null,
      message?: null
    ): DroppedSusuEventFilter;

    "MintedSusu(uint256,string,address,uint8)"(
      tokenId?: null,
      message?: null,
      owner?: null,
      team?: null
    ): MintedSusuEventFilter;
    MintedSusu(
      tokenId?: null,
      message?: null,
      owner?: null,
      team?: null
    ): MintedSusuEventFilter;

    "PickedUpSusu(uint256,uint256,string,address,address,uint8)"(
      tokenId?: null,
      location?: null,
      message?: null,
      sender?: null,
      owner?: null,
      team?: null
    ): PickedUpSusuEventFilter;
    PickedUpSusu(
      tokenId?: null,
      location?: null,
      message?: null,
      sender?: null,
      owner?: null,
      team?: null
    ): PickedUpSusuEventFilter;
  };

  estimateGas: {
    aimInitialSusu(
      tokenId: PromiseOrValue<BigNumberish>,
      location: PromiseOrValue<BigNumberish>,
      destination: PromiseOrValue<BigNumberish>,
      message: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    dropSusu(
      tokenId: PromiseOrValue<BigNumberish>,
      location: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    getAllSusuwataris(overrides?: CallOverrides): Promise<BigNumber>;

    getBaggedSusus(overrides?: CallOverrides): Promise<BigNumber>;

    getCurrentState(overrides?: CallOverrides): Promise<BigNumber>;

    giveSusuwatari(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    registerMe(
      team: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    tryPickupSusu(
      tokenId: PromiseOrValue<BigNumberish>,
      location: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    aimInitialSusu(
      tokenId: PromiseOrValue<BigNumberish>,
      location: PromiseOrValue<BigNumberish>,
      destination: PromiseOrValue<BigNumberish>,
      message: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    dropSusu(
      tokenId: PromiseOrValue<BigNumberish>,
      location: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    getAllSusuwataris(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getBaggedSusus(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getCurrentState(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    giveSusuwatari(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    registerMe(
      team: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    tryPickupSusu(
      tokenId: PromiseOrValue<BigNumberish>,
      location: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
