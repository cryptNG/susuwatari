/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type {
  LibSusuwatari,
  LibSusuwatariInterface,
} from "../../contracts/LibSusuwatari";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "originLocation",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "currentLocation",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "destination",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "team",
        type: "uint256",
      },
    ],
    name: "DroppedSusu",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "message",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "team",
        type: "uint8",
      },
    ],
    name: "MintedSusu",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "location",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "string",
        name: "message",
        type: "string",
      },
      {
        indexed: false,
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint8",
        name: "team",
        type: "uint8",
      },
    ],
    name: "PickedUpSusu",
    type: "event",
  },
] as const;

const _bytecode =
  "0x60808060405234601757603a9081601d823930815050f35b600080fdfe600080fdfea264697066735822122014b6cdc2006bb585c72228394e5bc0a9c01f6b6fab3f363e9dcb2bb81882986764736f6c63430008120033";

type LibSusuwatariConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: LibSusuwatariConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class LibSusuwatari__factory extends ContractFactory {
  constructor(...args: LibSusuwatariConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<LibSusuwatari> {
    return super.deploy(overrides || {}) as Promise<LibSusuwatari>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): LibSusuwatari {
    return super.attach(address) as LibSusuwatari;
  }
  override connect(signer: Signer): LibSusuwatari__factory {
    return super.connect(signer) as LibSusuwatari__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): LibSusuwatariInterface {
    return new utils.Interface(_abi) as LibSusuwatariInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): LibSusuwatari {
    return new Contract(address, _abi, signerOrProvider) as LibSusuwatari;
  }
}