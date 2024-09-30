import {
  createCreateTreeInstruction,
  PROGRAM_ID as BUBBLEGUM_PROGRAM_ID,
} from "@metaplex-foundation/mpl-bubblegum";
import { env } from "../env-config";
import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import { loadWallet, sendVersionedTx } from "./utils/util";
import {
  SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  SPL_NOOP_PROGRAM_ID,
  ValidDepthSizePair,
  getConcurrentMerkleTreeAccountSize,
} from "@solana/spl-account-compression";
import { SYSTEM_PROGRAM_ID } from "@raydium-io/raydium-sdk";

import * as bs58 from "bs58";

async function createMerkle() {
  const keypair = loadWallet(env.KEYPAIR_SRC);
  console.log("Payer Address:",keypair.publicKey.toBase58());
  const connection = new Connection(env.SOLANA_RPC);

  const merkleTree = loadWallet(env.MERKLE_TREE_SRC);
  console.log("Merkle Tree Address:",merkleTree.publicKey.toBase58());
  const [treeAuthority, _bump] = PublicKey.findProgramAddressSync(
    [merkleTree.publicKey.toBuffer()],
    BUBBLEGUM_PROGRAM_ID
  );
  console.log("Tree Authority PDA:", treeAuthority);

  const depthSizePair: ValidDepthSizePair = {
    maxDepth: 14,
    maxBufferSize: 64,
  };
  const space = getConcurrentMerkleTreeAccountSize(
    depthSizePair.maxDepth,
    depthSizePair.maxBufferSize
  );
  const createAccountIx = SystemProgram.createAccount({
    newAccountPubkey: merkleTree.publicKey,
    fromPubkey: keypair.publicKey,
    space: space,
    lamports: await connection.getMinimumBalanceForRentExemption(space),
    programId: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
  });
  const ix = createCreateTreeInstruction(
    {
      compressionProgram: SPL_ACCOUNT_COMPRESSION_PROGRAM_ID,
      logWrapper: SPL_NOOP_PROGRAM_ID,
      treeCreator: keypair.publicKey,
      treeAuthority: treeAuthority,
      systemProgram: SYSTEM_PROGRAM_ID,
      merkleTree: merkleTree.publicKey,
      payer: keypair.publicKey,
    },
    {
      maxDepth: depthSizePair.maxDepth,
      maxBufferSize: depthSizePair.maxBufferSize,
      public: false,
    }
  );
  const stx = await sendVersionedTx(
    connection,
    [createAccountIx, ix],
    keypair.publicKey,
    [keypair, merkleTree]
  );
  console.log("Signature:",stx);
}

createMerkle();
