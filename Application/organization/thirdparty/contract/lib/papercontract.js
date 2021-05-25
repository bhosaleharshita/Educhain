/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const { Contract, Context } = require('fabric-contract-api');

// PaperNet specifc classes
const CommercialPaper = require('./paper.js');
const PaperList = require('./paperlist.js');
const QueryUtils = require('./queries.js');

/**
 * A custom context provides easy access to list of all commercial papers
 */
class CommercialPaperContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.paperList = new PaperList(this);
    }

}

/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class CommercialPaperContract extends Contract {

    constructor() {
        // Unique namespace when multiple contracts per chaincode file
        super('org.papernet.commercialpaper');
    }

    /**
     * Define a custom context for commercial paper
    */
    createContext() {
        return new CommercialPaperContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    /**
     * Issue commercial paper
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer commercial paper issuer
     * @param {Integer} paperNumber paper number for this issuer
     * @param {String} issueDateTime paper issue date
     * @param {String} maturityDateTime paper maturity date
     * @param {Integer} faceValue face value of paper
    */
    async issue(ctx, student_id, certNumber, registration_DateTime, college_name, examno) {

        // create an instance of the paper
        let paper = CommercialPaper.createInstance(student_id, certNumber, registration_DateTime, college_name, parseInt(examno),'NA');

        // Smart contract, rather than paper, moves paper into ISSUED state
        paper.setIssued();

        // save the owner's MSP 
        let mspid = ctx.clientIdentity.getMSPID();
        paper.setOwnerMSP(mspid);

        // Newly issued paper is owned by the issuer to begin with (recorded for reporting purposes)
        paper.setOwner(student_id);

        // Add the paper to the list of all similar commercial papers in the ledger world state
        await ctx.paperList.addPaper(paper);

        // Must return a serialized paper to caller of smart contract
        return paper;
    }

    /**
     * Buy commercial paper
     *
      * @param {Context} ctx the transaction context
      * @param {String} issuer commercial paper issuer
      * @param {Integer} paperNumber paper number for this issuer
      * @param {String} currentOwner current owner of paper
      * @param {String} newOwner new owner of paper
      * @param {Integer} price price paid for this paper // transaction input - not written to asset
      * @param {String} purchaseDateTime time paper was purchased (i.e. traded)  // transaction input - not written to asset
     */

     //APPROVE TRANSACTION
    async buy(ctx, student_id, certNumber, collegename, newOwner, marks, approval_DateTime) {

        // Retrieve the current paper using key fields provided
        let paperKey = CommercialPaper.makeKey([student_id, certNumber]);
        let paper = await ctx.paperList.getPaper(paperKey);

        // Validate current owner
        if (paper.getcollege() !== collegename) {
            throw new Error('\nPaper ' + student_id + ' this certificate is not issued through ' + collegename);
        }

        // First buy moves state from ISSUED to TRADING (when running )
        if (paper.isIssued()) {
            paper.setTrading();
        }

        // Check paper is not already REDEEMED
        if (paper.isTrading()) {
            paper.setOwner(newOwner);
            paper.setMarks(marks);
            // save the owner's MSP 
            let mspid = ctx.clientIdentity.getMSPID();
            paper.setOwnerMSP(mspid);
        } else {
            throw new Error('\nPaper ' + student_id + certNumber + ' is not trading. Current state = ' + paper.getCurrentState());
        }

        // Update the paper
        await ctx.paperList.updatePaper(paper);
        return paper;
    }

    /**
      *  Buy request:  (2-phase confirmation: Commercial paper is 'PENDING' subject to completion of transfer by owning org)
      *  Alternative to 'buy' transaction
      *  Note: 'buy_request' puts paper in 'PENDING' state - subject to transfer confirmation [below].
      * 
      * @param {Context} ctx the transaction context
      * @param {String} issuer commercial paper issuer(studentprn)
      * @param {Integer} paperNumber paper number for this issuer
      * @param {String} currentOwner current owner of paper(studentprn)
      * @param {String} newOwner new owner of paper(sppu)                              // transaction input - not written to asset per se - but written to block
      * @param {Integer} updatrequest update msg(string) with what want to update with external references/links                         // transaction input - not written to asset per se - but written to block
                    
     */

     //UPDATE REQUEST BY STUDENT
    async buy_request(ctx, issuer, paperNumber, currentOwner,newOwner, updaterequest) {
        

        // Retrieve the current paper using key fields provided
        let paperKey = CommercialPaper.makeKey([issuer, paperNumber]);
        let paper = await ctx.paperList.getPaper(paperKey);

        // Validate current owner - this is really information for the user trying the sample, rather than any 'authorisation' check per se FYI
        if (paper.getOwner() !== currentOwner) {
            throw new Error('\nPaper ' + issuer + paperNumber + ' is not owned by ' + currentOwner + ' provided as a paraneter');
        }
        // paper set to 'PENDING' - can only be transferred (confirmed) by identity from owning org (MSP check).
        paper.updatemsg=updaterequest;
        paper.setOwner(newOwner);
        paper.setOwnerMSP('uniMSP');
        paper.setPending();
        //paper.setupdatemsg(updaterequest);
        

        // Update the paper
        await ctx.paperList.updatePaper(paper);
        return paper;
    }

    /**
     * transfer commercial paper: only the owning org has authority to execute. It is the complement to the 'buy_request' transaction. '[]' is optional below.
     * eg. issue -> buy_request -> transfer -> [buy ...n | [buy_request...n | transfer ...n] ] -> redeem
     * this transaction 'pair' is an alternative to the straight issue -> buy -> [buy....n] -> redeem ...path
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer commercial paper issuer(studentprn)
     * @param {Integer} paperNumber paper number for this issuer
     * @param {String} updatefield field to update
     * @param {String} newvalue  new value for updation field
     * @param {String} updation comment by university with timestamp.
    */

    //RESOLVING UPDATE REQUEST BY UNIVERSITY
    async transfer(ctx, issuer, paperNumber, updatefield,newvalue,updationcomment) {

        // Retrieve the current paper using key fields provided
        let paperKey = CommercialPaper.makeKey([issuer, paperNumber]);
        let paper = await ctx.paperList.getPaper(paperKey);

        // Validate current owner's MSP in the paper === invoking transferor's MSP id - can only transfer if you are the owning org.

        if (paper.getOwnerMSP() !== ctx.clientIdentity.getMSPID()) {
            throw new Error('\nPaper ' + issuer + paperNumber + ' is not owned by the current invoking Organisation, and not authorised to transfer');
        }

        // Paper needs to be 'pending' - which means you need to have run 'buy_pending' transaction first.
        if ( ! paper.isPending()) {
            throw new Error('\nPaper ' + issuer + paperNumber + ' is not open for Updation : \n must perform Update Request Trasaction First transaction first');
        }
        // else all good

        
        
        // switch(updatefield)
        // {
        // 	case 'marks':
        // 	{
        // 			paper.setMarks(newvalue);
        // 			break;
        // 	}
        // 	case 'clgname':
        // 	{
        // 		paper.setcollege(newvalue);
        // 		break;

        // 	}
        // 	case 'none':
        // 	{
        // 		break;
        // 	}

        // 	default:
        // 	{
        // 		throw new Error('\nThe updation field request is invalid');

        // 	}

        switch (updatefield) {
            case "marks":
                paper.setMarks(newvalue);  
                break;
            case "clgname":
                paper.setcollege(newvalue); 
                break;
            case "none":
                break;
            default: // else, unknown named query
                throw new Error('Not allowed to update this field ');
        }

        paper.setRedeemed();
        paper.after_updation_comment =updationcomment;
        paper.setOwner(issuer);
        // set the MSP of the transferee (so that, that org may also pass MSP check, if subsequently transferred/sold on)
        paper.setOwnerMSP(mhrdMSP);

        // Update the paper
        await ctx.paperList.updatePaper(paper);
        return paper;
    }

    /**
     * Redeem commercial paper
     *
     * @param {Context} ctx the transaction context
     * @param {String} issuer commercial paper issuer
     * @param {Integer} paperNumber paper number for this issuer
     * @param {String} redeemingOwner redeeming owner of paper
     * @param {String} issuingOwnerMSP the MSP of the org that the paper will be redeemed with.
     * @param {String} redeemDateTime time paper was redeemed
    */


    //GRANT TRANSACTION
    async redeem(ctx, student_id, certNumber, grantingOwner, studentOwnerMSP, grantDateTime,marks) {

        let paperKey = CommercialPaper.makeKey([student_id, certNumber]);

        let paper = await ctx.paperList.getPaper(paperKey);

        // Check paper is not alread in a state of REDEEMED
        if (paper.isRedeemed()) {
            throw new Error('\nPaper ' + student_id + certNumber + ' has already been granted');
        }

        // Validate current redeemer's MSP matches the invoking redeemer's MSP id - can only redeem if you are the owning org.

        if (paper.getOwnerMSP() !== ctx.clientIdentity.getMSPID()) {
            throw new Error('\nPaper ' + student_id + certNumber + ' cannot be granted by ' + ctx.clientIdentity.getMSPID() + ', as it is not the authorised owning Organisation');
        }

        // As this is just a sample, can show additional verification check: that the redeemer provided matches that on record, before redeeming it
        if (paper.getOwner() === grantingOwner) {
            paper.setOwner(paper.getIssuer());
            paper.setOwnerMSP(studentOwnerMSP);
            paper.setRedeemed();
            paper.setMarks(marks);
            paper.grantDateTime = grantDateTime; // record redemption date against the asset (the complement to 'issue date')
        } else {
            throw new Error('\nGranting owner: ' + grantingOwner + ' organisation does not currently own paper: ' + student_id + paperNumber);
        }

        await ctx.paperList.updatePaper(paper);
        return paper;
    }

    // Query transactions

    /**
     * Query history of a commercial paper
     * @param {Context} ctx the transaction context
     * @param {String} issuer commercial paper issuer
     * @param {Integer} paperNumber paper number for this issuer
    */
    async queryHistory(ctx, issuer, paperNumber) {

        // Get a key to be used for History query

        let query = new QueryUtils(ctx, 'org.papernet.paper');
        let results = await query.getAssetHistory(issuer, paperNumber); // (cpKey);
        return results;

    }

    /**
    * queryOwner commercial paper: supply name of owning org, to find list of papers based on owner field
    * @param {Context} ctx the transaction context
    * @param {String} owner commercial paper owner
    */
    async queryOwner(ctx, owner) {

        let query = new QueryUtils(ctx, 'org.papernet.paper');
        let owner_results = await query.queryKeyByOwner(owner);

        return owner_results;
    }

    /**
    * queryPartial commercial paper - provide a prefix eg. "DigiBank" will list all papers _issued_ by DigiBank etc etc
    * @param {Context} ctx the transaction context
    * @param {String} prefix asset class prefix (added to paperlist namespace) eg. org.papernet.paperMagnetoCorp asset listing: papers issued by MagnetoCorp.
    */
    async queryPartial(ctx, prefix) {

        let query = new QueryUtils(ctx, 'org.papernet.paper');
        let partial_results = await query.queryKeyByPartial(prefix);

        return partial_results;
    }

    /**
    * queryAdHoc commercial paper - supply a custom mango query
    * eg - as supplied as a param:     
    * ex1:  ["{\"selector\":{\"faceValue\":{\"$lt\":8000000}}}"]
    * ex2:  ["{\"selector\":{\"faceValue\":{\"$gt\":4999999}}}"]
    * 
    * @param {Context} ctx the transaction context
    * @param {String} queryString querystring
    */
    async queryAdhoc(ctx, queryString) {

        let query = new QueryUtils(ctx, 'org.papernet.paper');
        let querySelector = JSON.parse(queryString);
        let adhoc_results = await query.queryByAdhoc(querySelector);

        return adhoc_results;
    }


    /**
     * queryNamed - supply named query - 'case' statement chooses selector to build (pre-canned for demo purposes)
     * @param {Context} ctx the transaction context
     * @param {String} queryname the 'named' query (built here) - or - the adHoc query string, provided as a parameter
     */
    async queryNamed(ctx, queryname) {
        let querySelector = {};
        switch (queryname) {
            case "redeemed":
                querySelector = { "selector": { "currentState": 4 } };  // 4 = redeemd state
                break;
            case "trading":
                querySelector = { "selector": { "currentState": 3 } };  // 3 = trading state
                break;
            case "value":
                // may change to provide as a param - fixed value for now in this sample
                querySelector = { "selector": { "faceValue": { "$eq": 4001 } } };  // to test, issue CommPapers with faceValue <= or => this figure.
                break;
            default: // else, unknown named query
                throw new Error('invalid named query supplied: ' + queryname + '- please try again ');
        }

        let query = new QueryUtils(ctx, 'org.papernet.paper');
        let adhoc_results = await query.queryByAdhoc(querySelector);

        return adhoc_results;
    }

}

module.exports = CommercialPaperContract;
