const forge = require('node-forge');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('--- Generador de Certificados para AFIP ---');
console.log('Este script generará una Llave Privada (afip.key) y un Pedido de Certificado (afip.csr).');

rl.question('Ingrese el nombre de su empresa o su nombre completo (Common Name): ', (commonName) => {
    if (!commonName) {
        console.error('El nombre es obligatorio.');
        process.exit(1);
    }

    console.log('\nGenerando llave privada de 2048 bits... (puede tardar unos segundos)');

    // 1. Generar Key Pair
    const keys = forge.pki.rsa.generateKeyPair(2048);

    // 2. Guardar Private Key
    const privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);
    fs.writeFileSync('afip.key', privateKeyPem);
    console.log('✅ Llave privada guardada en "afip.key".');

    // 3. Crear CSR
    console.log('Creando solicitud de certificado (CSR)...');
    const csr = forge.pki.createCertificationRequest();
    csr.publicKey = keys.publicKey;
    csr.setSubject([{
        name: 'commonName',
        value: commonName
    }, {
        name: 'countryName',
        value: 'AR'
    }, {
        name: 'organizationName',
        value: commonName
    }]);

    // Firmar CSR con la llave privada
    csr.sign(keys.privateKey);

    // 4. Guardar CSR
    const csrPem = forge.pki.certificationRequestToPem(csr);
    fs.writeFileSync('afip.csr', csrPem);
    console.log('✅ Solicitud de certificado guardada en "afip.csr".');

    console.log('\n--- LISTO ---');
    console.log('Ahora debés subir "afip.csr" a la web de AFIP para obtener tu certificado (.crt).');
    console.log('Consultá la guía AFIP_SETUP.md para más detalles.');

    rl.close();
});
