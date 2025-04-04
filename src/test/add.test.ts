import { assert, expect } from "chai";
import { add } from "../add.js";

describe('Add function', function(){
    it('should 3+4 = 7', function(){
        assert.equal(add(3, 4), 7);
    });
console.log('test');
});