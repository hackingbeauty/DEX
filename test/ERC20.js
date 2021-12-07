// This is an exmaple test file. Hardhat will run every *.js file in `test/`,
// so feel free to add new ones.

// Hardhat tests are normally written with Mocha and Chai.

// We import Chai to use its asserting functions here.
const { expect } = require('chai');

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` recieves the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe('Token contract', function () {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

  let ERC20;
  let hardhatToken;
  let founder;
  let addr1;
  let addr2;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    ERC20 = await ethers.getContractFactory('Cryptos');
    [founder, addr1, addr2, ...addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.
    hardhatToken = await ERC20.deploy();
    await hardhatToken.deployed(); //simula que la transaccion fue firmada

    // We can interact with the contract by calling `hardhatToken.method()`
    await hardhatToken.deployed();
  });

  describe('Allowance', function () {
    //no se pueden poner cosas aca
    it('Should return the correct allowance amount', async function () {
      // We can call methods on the contract by calling `hardhatToken.method()`
      // and passing in the arguments.
      const firstAllowance = await hardhatToken.allowance(
        addr1.address,
        addr2.address
      );
      expect(firstAllowance).to.equal(0);
    });

    it('Should approve for allowances between accounts', async function () {
      await hardhatToken.approve(addr1.address, 100);
      const secondAllowance = await hardhatToken.allowance(
        founder.address,
        addr1.address
      );
      expect(secondAllowance).to.equal(100);
    });

    it('Should transfer from allower to allowed', async function () {
      await hardhatToken.approve(addr1.address, 100);//no estan concatenadas
      await hardhatToken.transferFrom(founder.address, addr1.address, 70);
      const thirdAllowance = await hardhatToken.allowance(
        founder.address,
        addr1.address
      );
      expect(thirdAllowance).to.equal(30);
    });
  });

  // You can nest describe calls to create subsections.
  describe('Deployment 2', function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it('Should set the right founder', async function () {
      // Expect receives a value, and wraps it in an assertion objet. These
      // objects have a lot of utility methods to assert values.

      // This test expects the founder variable stored in the contract to be equal
      // to our Signer's founder.
      expect(await hardhatToken.founder()).to.equal(founder.address);
    });

    it('Should assign the total supply of tokens to the founder', async function () {
      const founderBalance = await hardhatToken.balanceOf(founder.address);
      expect(await hardhatToken.totalSupply()).to.equal(founderBalance);
    });
  });

  describe('Transactions 2', function () {
    it('Should transfer tokens between accounts', async function () {
      // Transfer 50 tokens from founder to addr1
      const firstTransfer = await hardhatToken.transfer(addr1.address, 50); //tiene por default al founder de msg.sender de la transaccion
      const addr1Balance = await hardhatToken.balanceOf(addr1.address);

      expect(addr1Balance).to.equal(50);
      // expect(firstTransfer).to.equal(true);

      // Transfer 50 tokens from addr1 to addr2
      // We use .connect(signer) to send a transaction from another account
      await hardhatToken.connect(addr1).transfer(addr2.address, 50); //por default esta connect to founder, aca lo cambiamos a addr1
      const addr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
      const addr1Balance2 = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance2).to.equal(0);
    });

    it('Should fail if sender doesn’t have enough tokens', async function () {
      const initialfounderBalance = await hardhatToken.balanceOf(
        founder.address
      );

      // Try to send 1 token from addr1 (0 tokens) to founder (1000 tokens).
      // `require` will evaluate false and revert the transaction.
      await expect(hardhatToken.connect(addr1).transfer(founder.address, 1)).to
        .be.reverted; //each time it connects from an addr other than the founders, it will connect()
      //revertedWith es el error msg

      // founder balance shouldn't have changed.
      expect(await hardhatToken.balanceOf(founder.address)).to.equal(
        initialfounderBalance
      );
    });

    it('Should update balances after transfers', async function () {
      const initialfounderBalance = await hardhatToken.balanceOf(
        founder.address
      );

      // Transfer 100 tokens from founder to addr1.
      await hardhatToken.transfer(addr1.address, 100);

      // Transfer another 50 tokens from founder to addr2.
      await hardhatToken.transfer(addr2.address, 50);

      // Check balances.
      const finalfounderBalance = await hardhatToken.balanceOf(founder.address);
      expect(finalfounderBalance).to.equal(initialfounderBalance - 150);

      const addr1Balance = await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(100);

      const addr2Balance = await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(50);
    });
  });
});


//dudas: si estan expuestos el emit y el return
