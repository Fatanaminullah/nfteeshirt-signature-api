// =============================================================
// ===================== M U T A T I O N S  ====================
// =============================================================

const { default: Axios } = require("axios")

exports.CLAIM_VOUCHER = `
mutation CLAIM_VOUCHER ($promotion_id: Int!, $wallet_id: String!, $nft_id: String!, $email: String!) {
  claim(input: {
    promotion_id : $promotion_id
    wallet_id : $wallet_id
    nft_id: $nft_id
    email: $email
  }) {
    status
    message
    coupon_code
  }
}
`
// ========================================================
// =================== F U N C T I O N S ==================
// ========================================================
exports.getGraphql = async (query, variables = {}, url, token) => {
    let headers = {}
    if (token) {
        headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    } else {
        headers = { "Content-Type": "application/json" }
    }
    try {
        const res = await Axios({
            url,
            method: "POST",
            headers,
            data: JSON.stringify({ query, variables }),
        })
        return res.data
    } catch (error) {
        throw new Error("Failed to fetch API")
    }
}
