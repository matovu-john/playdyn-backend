function failed(message) {
    return {
        status: 'failed',
        reason: message
    }
}

module.exports = failed;