const palindrom = require("../utils/for_testing").palindrom

test("palindrom of a", () => {
    const res = palindrom("a")

    expect(res).toBe("a")
})

test("palindrom of react", () => {
    const res = palindrom("react")

    expect(res).toBe("tcaer")
})

test("palindrom of saippuakauppias", () => {
    const res = palindrom("saippuakauppias")

    expect(res).toBe("saippuakauppias")
})

