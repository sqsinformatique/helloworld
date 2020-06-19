export function isValidPhone(p) {
    var phoneRe = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    var digits = p.replace(/\D/g, "");
    return phoneRe.test(digits);
}
