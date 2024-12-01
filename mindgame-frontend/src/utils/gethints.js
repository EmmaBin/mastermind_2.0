export default function getHints(secretCode) {
    //converted to a number
    const numericCode = secretCode.map(Number);

    const total = numericCode.reduce((accum, curr) => accum + curr, 0);

    const firstNumAttri = numericCode[0] % 2 === 0 ? "even" : "odd";

    const lastNumAttri = numericCode[numericCode.length - 1] % 2 === 0 ? "even" : "odd";

    return {
        total,
        firstNumAttri,
        lastNumAttri,
    };
}