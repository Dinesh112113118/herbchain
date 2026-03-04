'use strict';

const { Contract } = require('fabric-contract-api');

class HerbChainContract extends Contract {

    // Helper to validate roles
    async _checkRole(ctx, expectedRole) {
        // In a real Hyperledger deployment we would inspect the client identity
        // e.g. using ctx.clientIdentity.getAttributeValue('role')
        // For this proof of concept, we will rely on the backend enforcing roles
        // and passing a role argument or assume the invoker is trusted.
        // We'll leave it as a placeholder to demonstrate permissioned logic.
        return true;
    }

    // Register a new Herb Collection Event (Collector)
    async registerCollection(ctx, collectionId, herbName, collectorName, lat, long, quantity, farmDetails, timestamp) {
        const exists = await this._entityExists(ctx, collectionId);
        if (exists) {
            throw new Error(`The collection ${collectionId} already exists`);
        }

        const collectionEvent = {
            docType: 'collection',
            collectionId,
            herbName,
            collectorName,
            geoLocation: { lat, long },
            quantity: parseFloat(quantity),
            farmDetails,
            timestamp,
        };

        await ctx.stub.putState(collectionId, Buffer.from(JSON.stringify(collectionEvent)));
        return JSON.stringify(collectionEvent);
    }

    // Upload Lab Quality Test (Lab Technician)
    async uploadQualityTest(ctx, testId, collectionId, moisturePercentage, pesticideStatus, labName, testDate) {
        const collectionExists = await this._entityExists(ctx, collectionId);
        if (!collectionExists) {
            throw new Error(`The collection ${collectionId} does not exist`);
        }

        const testExists = await this._entityExists(ctx, testId);
        if (testExists) {
            throw new Error(`The test ${testId} already exists`);
        }

        const qualityTest = {
            docType: 'qualityTest',
            testId,
            collectionId,
            moisturePercentage: parseFloat(moisturePercentage),
            pesticideStatus,
            labName,
            testDate,
        };

        await ctx.stub.putState(testId, Buffer.from(JSON.stringify(qualityTest)));
        return JSON.stringify(qualityTest);
    }

    // Create a Product Batch (Manufacturer)
    async createBatch(ctx, batchId, collectionIdsStr, testIdsStr, manufactureDate, expiryDate, qrHash) {
        const batchExists = await this._entityExists(ctx, batchId);
        if (batchExists) {
            throw new Error(`The batch ${batchId} already exists`);
        }

        // collectionIdsStr and testIdsStr expected as comma separated strings
        const linkedCollectionIds = collectionIdsStr.split(',');
        const linkedTestIds = testIdsStr.split(',');

        const productBatch = {
            docType: 'batch',
            batchId,
            linkedCollectionIds,
            linkedTestIds,
            manufactureDate,
            expiryDate,
            qrHash,
        };

        await ctx.stub.putState(batchId, Buffer.from(JSON.stringify(productBatch)));
        return JSON.stringify(productBatch);
    }

    // Retrieve full Traceability of a Batch
    async getFullTraceability(ctx, batchId) {
        const batchBytes = await ctx.stub.getState(batchId);
        if (!batchBytes || batchBytes.length === 0) {
            throw new Error(`The batch ${batchId} does not exist`);
        }

        const batch = JSON.parse(batchBytes.toString());

        // Fetch all linked collections
        const collections = [];
        for (const cId of batch.linkedCollectionIds) {
            const cBytes = await ctx.stub.getState(cId.trim());
            if (cBytes && cBytes.length > 0) {
                collections.push(JSON.parse(cBytes.toString()));
            }
        }

        // Fetch all linked tests
        const tests = [];
        for (const tId of batch.linkedTestIds) {
            const tBytes = await ctx.stub.getState(tId.trim());
            if (tBytes && tBytes.length > 0) {
                tests.push(JSON.parse(tBytes.toString()));
            }
        }

        return JSON.stringify({
            batch,
            collections,
            tests
        });
    }

    // Get specific entity by ID (Collection, Test, or Batch)
    async getEntity(ctx, id) {
        const bytes = await ctx.stub.getState(id);
        if (!bytes || bytes.length === 0) {
            throw new Error(`Entity ${id} does not exist`);
        }
        return bytes.toString();
    }

    // Utility: Check if entity exists
    async _entityExists(ctx, id) {
        const bytes = await ctx.stub.getState(id);
        return bytes && bytes.length > 0;
    }
}

module.exports = HerbChainContract;
