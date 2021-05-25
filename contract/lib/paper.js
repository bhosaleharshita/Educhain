/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('./../ledger-api/state.js');

// Enumerate commercial paper state values
const cpState = {
    REGISTERED: 1,
    PENDING: 2,
    APPROVED: 3,
    GRANTED: 4
};

/*
ISSUED:REGISTERED:1
TRADING:APPROVED BY CLG:3
REDEEMED:GRANTED:4
*/

/**
 * CommercialPaper class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class CommercialPaper extends State {

    constructor(obj) {
        super(CommercialPaper.getClass(), [obj.student_id, obj.certNumber]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
    */
    getIssuer() {
        return this.student_id;
    }

    setIssuer(newIssuer) {
        this.student_id = newIssuer;
    }

    getOwner() {
        return this.owner;
    }

    setOwnerMSP(mspid) {
        this.mspid = mspid;
    }

    getOwnerMSP() {
        return this.mspid;
    }

    setOwner(newOwner) {
        this.owner = newOwner;
    }

    setMarks(mrks){
    	this.marks=mrks;
    }

    getMarks(mrks){
    	return this.marks;
    }

    setcollee(clg){
        this.collegename=clg;
    }
    getcollege(){
        return this.collegename;
    }

    /**
     * Useful methods to encapsulate commercial paper states
     */
    setIssued() {
        this.currentState = cpState.REGISTERED;
    }

    setTrading() {
        this.currentState = cpState.APPROVED;
    }

    setRedeemed() {
        this.currentState = cpState.GRANTED;
    }

    setPending() {
        this.currentState = cpState.PENDING;
    }

    isIssued() {
        return this.currentState === cpState.REGISTERED;
    }

    isTrading() {
        return this.currentState === cpState.APPROVED;
    }

    isRedeemed() {
        return this.currentState === cpState.GRANTED;
    }

    isPending() {
        return this.currentState === cpState.PENDING;
    }

    static fromBuffer(buffer) {
        return CommercialPaper.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, CommercialPaper);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(student_id, certNumber, registration_DateTime, collegename, examno, marks) {
        return new CommercialPaper({student_id, certNumber, registration_DateTime, collegename, examno, marks});
    }

    static getClass() {
        return 'org.papernet.commercialpaper';
    }
}

module.exports = CommercialPaper;
