function sleep(delay) {
    let resume = function () {};
    setTimeout(resume, delay);
}


yield