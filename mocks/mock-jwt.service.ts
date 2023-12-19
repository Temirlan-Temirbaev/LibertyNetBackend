import { JwtService } from "@nestjs/jwt";

const originalVerify = JwtService.prototype.verify;

JwtService.prototype.verify = jest.fn().mockImplementation((token, options) => {
    return originalVerify.call(this, token, options);
});

const mockedJwtService = new JwtService();

export { mockedJwtService };
