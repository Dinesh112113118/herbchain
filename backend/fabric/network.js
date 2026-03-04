/**
 * Fabric Network Abstraction Layer
 * Since setting up a real Hyperledger Fabric network is very heavy,
 * we provide a mock mode for rapid UI/UX testing offline.
 */
// require('fabric-network') moved inside functions to allow mock mode

const fs = require('fs');
const path = require('path');
const HerbChainContract = require('../../chaincode/lib/herbchain');

const MOCK_MODE = process.env.MOCK_FABRIC === 'true';

// Mock Ledger State
const mockState = new Map();

// Mock Context to pass into the Chaincode
class MockStub {
    async putState(key, value) {
        mockState.set(key, value);
    }
    async getState(key) {
        return mockState.get(key) || null;
    }
}
class MockContext {
    constructor() {
        this.stub = new MockStub();
    }
}

const mockContract = new HerbChainContract();

async function getContract() {
    if (MOCK_MODE) {
        return mockContract;
    }

    // Real implementation would go here (e.g. connecting using org1 wallet and gateway)
    throw new Error("Real Fabric network not configured for this demo. Set MOCK_FABRIC=true in .env");
}

async function submitTransaction(fnName, ...args) {
    if (MOCK_MODE) {
        console.log(`[MOCK FABRIC] Invoking ${fnName} with args:`, args);
        const ctx = new MockContext();
        if (typeof mockContract[fnName] === 'function') {
            const result = await mockContract[fnName](ctx, ...args);
            return result;
        } else {
            throw new Error(`Chaincode function ${fnName} not found`);
        }
    }
}

async function evaluateTransaction(fnName, ...args) {
    if (MOCK_MODE) {
        console.log(`[MOCK FABRIC] Evaluating ${fnName} with args:`, args);
        const ctx = new MockContext();
        if (typeof mockContract[fnName] === 'function') {
            const result = await mockContract[fnName](ctx, ...args);
            return result;
        } else {
            throw new Error(`Chaincode function ${fnName} not found`);
        }
    }
}

// Helper query function strictly for Dashboard UI purposes (not part of secure chaincode)
async function getAllCollections() {
    if (MOCK_MODE) {
        const collections = [];
        for (const [key, value] of mockState.entries()) {
            const obj = JSON.parse(value.toString());
            if (obj.docType === 'collection') {
                collections.push(obj);
            }
        }
        return collections;
    }
    return [];
}

async function getAllTests() {
    if (MOCK_MODE) {
        const tests = [];
        for (const [key, value] of mockState.entries()) {
            const obj = JSON.parse(value.toString());
            if (obj.docType === 'qualityTest') {
                tests.push(obj);
            }
        }
        return tests;
    }
    return [];
}

async function getAllBatches() {
    if (MOCK_MODE) {
        const batches = [];
        for (const [key, value] of mockState.entries()) {
            const obj = JSON.parse(value.toString());
            if (obj.docType === 'batch') {
                batches.push(obj);
            }
        }
        return batches;
    }
    return [];
}

module.exports = {
    submitTransaction,
    evaluateTransaction,
    getAllCollections,
    getAllTests,
    getAllBatches
};
