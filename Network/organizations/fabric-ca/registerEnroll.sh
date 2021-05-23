#!/bin/bash



function createthirdparty() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/thirdparty.example.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/thirdparty.example.com/

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:11054 --caname ca-thirdparty --tls.certfiles "${PWD}/organizations/fabric-ca/thirdparty/tls-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-thirdparty.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-thirdparty.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-thirdparty.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-11054-ca-thirdparty.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/peerOrganizations/thirdparty.example.com/msp/config.yaml"

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-thirdparty --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "${PWD}/organizations/fabric-ca/thirdparty/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-thirdparty --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "${PWD}/organizations/fabric-ca/thirdparty/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-thirdparty --id.name thirdpartyadmin --id.secret thirdpartyadminpw --id.type admin --tls.certfiles "${PWD}/organizations/fabric-ca/thirdparty/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:11054 --caname ca-thirdparty -M "${PWD}/organizations/peerOrganizations/thirdparty.example.com/peers/peer0.thirdparty.example.com/msp" --csr.hosts peer0.thirdparty.example.com --tls.certfiles "${PWD}/organizations/fabric-ca/thirdparty/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/thirdparty.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/thirdparty.example.com/peers/peer0.thirdparty.example.com/msp/config.yaml"

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:11054 --caname ca-thirdparty -M "${PWD}/organizations/peerOrganizations/thirdparty.example.com/peers/peer0.thirdparty.example.com/tls" --enrollment.profile tls --csr.hosts peer0.thirdparty.example.com --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/thirdparty/tls-cert.pem"
  { set +x; } 2>/dev/null


  cp "${PWD}/organizations/peerOrganizations/thirdparty.example.com/peers/peer0.thirdparty.example.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/thirdparty.example.com/peers/peer0.thirdparty.example.com/tls/ca.crt"
  cp "${PWD}/organizations/peerOrganizations/thirdparty.example.com/peers/peer0.thirdparty.example.com/tls/signcerts/"* "${PWD}/organizations/peerOrganizations/thirdparty.example.com/peers/peer0.thirdparty.example.com/tls/server.crt"
  cp "${PWD}/organizations/peerOrganizations/thirdparty.example.com/peers/peer0.thirdparty.example.com/tls/keystore/"* "${PWD}/organizations/peerOrganizations/thirdparty.example.com/peers/peer0.thirdparty.example.com/tls/server.key"

  mkdir "${PWD}/organizations/peerOrganizations/thirdparty.example.com/msp/tlscacerts"
  cp "${PWD}/organizations/peerOrganizations/thirdparty.example.com/peers/peer0.thirdparty.example.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/thirdparty.example.com/msp/tlscacerts/ca.crt"

  mkdir "${PWD}/organizations/peerOrganizations/thirdparty.example.com/tlsca"
  cp "${PWD}/organizations/peerOrganizations/thirdparty.example.com/peers/peer0.thirdparty.example.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/thirdparty.example.com/tlsca/tlsca.thirdparty.example.com-cert.pem"

  mkdir "${PWD}/organizations/peerOrganizations/thirdparty.example.com/ca"
  cp "${PWD}/organizations/peerOrganizations/thirdparty.example.com/peers/peer0.thirdparty.example.com/msp/cacerts/"* "${PWD}/organizations/peerOrganizations/thirdparty.example.com/ca/ca.thirdparty.example.com-cert.pem"

  infoln "Generating the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:11054 --caname ca-thirdparty -M "${PWD}/organizations/peerOrganizations/thirdparty.example.com/users/User1@thirdparty.example.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/thirdparty/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/thirdparty.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/thirdparty.example.com/users/User1@thirdparty.example.com/msp/config.yaml"

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://thirdpartyadmin:thirdpartyadminpw@localhost:11054 --caname ca-thirdparty -M "${PWD}/organizations/peerOrganizations/thirdparty.example.com/users/Admin@thirdparty.example.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/thirdparty/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/thirdparty.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/thirdparty.example.com/users/Admin@thirdparty.example.com/msp/config.yaml"
}

# function createthirdparty() {
#   infoln "Enrolling the CA admin"
#   mkdir -p organizations/peerOrganizations/thirdparty.example.com/

#   export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/thirdparty.example.com/

#   set -x
#   fabric-ca-client enroll -u https://admin:adminpw@localhost:11054 --caname ca-uni --tls.certfiles "${PWD}/organizations/fabric-ca/thirdparty/tls-cert.pem"
#   { set +x; } 2>/dev/null

#   echo 'NodeOUs:
#   Enable: true
#   ClientOUIdentifier:
#     Certificate: cacerts/localhost-11054-ca-thirdparty.pem
#     OrganizationalUnitIdentifier: client
#   PeerOUIdentifier:
#     Certificate: cacerts/localhost-11054-ca-thirdparty.pem
#     OrganizationalUnitIdentifier: peer
#   AdminOUIdentifier:
#     Certificate: cacerts/localhost-11054-ca-thirdparty.pem
#     OrganizationalUnitIdentifier: admin
#   OrdererOUIdentifier:
#     Certificate: cacerts/localhost-11054-ca-thirdparty.pem
#     OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/peerOrganizations/thirdparty.example.com/msp/config.yaml"

#   infoln "Registering peer0"
#   set -x
#   fabric-ca-client register --caname ca-thirdparty --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "${PWD}/organizations/fabric-ca/thirdparty/tls-cert.pem"
#   { set +x; } 2>/dev/null

#   infoln "Registering user"
#   set -x
#   fabric-ca-client register --caname ca-uni --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "${PWD}/organizations/fabric-ca/thirdparty/tls-cert.pem"
#   { set +x; } 2>/dev/null

#   infoln "Registering the org admin"
#   set -x
#   fabric-ca-client register --caname ca-uni --id.name uniadmin --id.secret uniadminpw --id.type admin --tls.certfiles "${PWD}/organizations/fabric-ca/thirdparty/tls-cert.pem"
#   { set +x; } 2>/dev/null

#   infoln "Generating the peer0 msp"
#   set -x
#   fabric-ca-client enroll -u https://peer0:peer0pw@localhost:11054 --caname ca-uni -M "${PWD}/organizations/peerOrganizations/thirdparty.example.com/peers/peer0.thirdparty.example.com/msp" --csr.hosts peer0.uni.example.com --tls.certfiles "${PWD}/organizations/fabric-ca/uni/tls-cert.pem"
#   { set +x; } 2>/dev/null

#   cp "${PWD}/organizations/peerOrganizations/thirdparty.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/thirdparty.example.com/peers/peer0.thirdparty.example.com/msp/config.yaml"

#   infoln "Generating the peer0-tls certificates"
#   set -x
#   fabric-ca-client enroll -u https://peer0:peer0pw@localhost:11054 --caname ca-uni -M "${PWD}/organizations/peerOrganizations/uni.example.com/peers/peer0.thirdparty.example.com/tls" --enrollment.profile tls --csr.hosts peer0.uni.example.com --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/uni/tls-cert.pem"
#   { set +x; } 2>/dev/null

#   cp "${PWD}/organizations/peerOrganizations/thirdparty.example.com/peers/peer0.thirdparty.example.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/thirdparty.example.com/peers/peer0.thirdparty.example.com/tls/ca.crt"
#   cp "${PWD}/organizations/peerOrganizations/thirdparty.example.com/peers/peer0.thirdparty.example.com/tls/signcerts/"* "${PWD}/organizations/peerOrganizations/thirdparty.example.com/peers/peer0.thirdparty.example.com/tls/server.crt"
#   cp "${PWD}/organizations/peerOrganizations/thirdparty.example.com/peers/peer0.thirdparty.example.com/tls/keystore/"* "${PWD}/organizations/peerOrganizations/thirdparty.example.com/peers/peer0.thirdparty.example.com/tls/server.key"

#   mkdir -p "${PWD}/organizations/peerOrganizations/thirdparty.example.com/msp/tlscacerts"
#   cp "${PWD}/organizations/peerOrganizations/thirdparty.example.com/peers/peer0.thirdparty.example.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/thirdparty.example.com/msp/tlscacerts/ca.crt"

#   mkdir -p "${PWD}/organizations/peerOrganizations/thirdparty.example.com/tlsca"
#   cp "${PWD}/organizations/peerOrganizations/thirdparty.example.com/peers/peer0.thirdparty.example.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/thirdparty.example.com/tlsca/tlsca.thirdparty.example.com-cert.pem"

#   mkdir -p "${PWD}/organizations/peerOrganizations/thirdparty.example.com/ca"
#   cp "${PWD}/organizations/peerOrganizations/thirdparty.example.com/peers/peer0.thirdparty.example.com/msp/cacerts/"* "${PWD}/organizations/peerOrganizations/thirdparty.example.com/ca/ca.thirdparty.example.com-cert.pem"

#   infoln "Generating the user msp"
#   set -x
#   fabric-ca-client enroll -u https://user1:user1pw@localhost:11054 --caname ca-uni -M "${PWD}/organizations/peerOrganizations/thirdparty.example.com/users/User1@thirdparty.example.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/uni/tls-cert.pem"
#   { set +x; } 2>/dev/null

#   cp "${PWD}/organizations/peerOrganizations/thirdparty.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/thirdparty.example.com/users/User1@thirdparty.example.com/msp/config.yaml"

#   infoln "Generating the org admin msp"
#   set -x
#   fabric-ca-client enroll -u https://uniadmin:uniadminpw@localhost:7054 --caname ca-uni -M "${PWD}/organizations/peerOrganizations/thirdparty.example.com/users/Admin@thirdparty.example.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/uni/tls-cert.pem"
#   { set +x; } 2>/dev/null

#   cp "${PWD}/organizations/peerOrganizations/thirdparty.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/thirdparty.example.com/users/Admin@uni.example.com/msp/config.yaml"
# }


function createuni() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/uni.example.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/uni.example.com/

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:7054 --caname ca-uni --tls.certfiles "${PWD}/organizations/fabric-ca/uni/tls-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-uni.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-uni.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-uni.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-uni.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/peerOrganizations/uni.example.com/msp/config.yaml"

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-uni --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "${PWD}/organizations/fabric-ca/uni/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-uni --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "${PWD}/organizations/fabric-ca/uni/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-uni --id.name uniadmin --id.secret uniadminpw --id.type admin --tls.certfiles "${PWD}/organizations/fabric-ca/uni/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-uni -M "${PWD}/organizations/peerOrganizations/uni.example.com/peers/peer0.uni.example.com/msp" --csr.hosts peer0.uni.example.com --tls.certfiles "${PWD}/organizations/fabric-ca/uni/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/uni.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/uni.example.com/peers/peer0.uni.example.com/msp/config.yaml"

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-uni -M "${PWD}/organizations/peerOrganizations/uni.example.com/peers/peer0.uni.example.com/tls" --enrollment.profile tls --csr.hosts peer0.uni.example.com --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/uni/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/uni.example.com/peers/peer0.uni.example.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/uni.example.com/peers/peer0.uni.example.com/tls/ca.crt"
  cp "${PWD}/organizations/peerOrganizations/uni.example.com/peers/peer0.uni.example.com/tls/signcerts/"* "${PWD}/organizations/peerOrganizations/uni.example.com/peers/peer0.uni.example.com/tls/server.crt"
  cp "${PWD}/organizations/peerOrganizations/uni.example.com/peers/peer0.uni.example.com/tls/keystore/"* "${PWD}/organizations/peerOrganizations/uni.example.com/peers/peer0.uni.example.com/tls/server.key"

  mkdir -p "${PWD}/organizations/peerOrganizations/uni.example.com/msp/tlscacerts"
  cp "${PWD}/organizations/peerOrganizations/uni.example.com/peers/peer0.uni.example.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/uni.example.com/msp/tlscacerts/ca.crt"

  mkdir -p "${PWD}/organizations/peerOrganizations/uni.example.com/tlsca"
  cp "${PWD}/organizations/peerOrganizations/uni.example.com/peers/peer0.uni.example.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/uni.example.com/tlsca/tlsca.uni.example.com-cert.pem"

  mkdir -p "${PWD}/organizations/peerOrganizations/uni.example.com/ca"
  cp "${PWD}/organizations/peerOrganizations/uni.example.com/peers/peer0.uni.example.com/msp/cacerts/"* "${PWD}/organizations/peerOrganizations/uni.example.com/ca/ca.uni.example.com-cert.pem"

  infoln "Generating the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:7054 --caname ca-uni -M "${PWD}/organizations/peerOrganizations/uni.example.com/users/User1@uni.example.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/uni/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/uni.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/uni.example.com/users/User1@uni.example.com/msp/config.yaml"

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://uniadmin:uniadminpw@localhost:7054 --caname ca-uni -M "${PWD}/organizations/peerOrganizations/uni.example.com/users/Admin@uni.example.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/uni/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/uni.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/uni.example.com/users/Admin@uni.example.com/msp/config.yaml"
}

function createmhrd() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/mhrd.example.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/mhrd.example.com/

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:8054 --caname ca-mhrd --tls.certfiles "${PWD}/organizations/fabric-ca/mhrd/tls-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-mhrd.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-mhrd.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-mhrd.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-mhrd.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/peerOrganizations/mhrd.example.com/msp/config.yaml"

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-mhrd --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles "${PWD}/organizations/fabric-ca/mhrd/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-mhrd --id.name user1 --id.secret user1pw --id.type client --tls.certfiles "${PWD}/organizations/fabric-ca/mhrd/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-mhrd --id.name mhrdadmin --id.secret mhrdadminpw --id.type admin --tls.certfiles "${PWD}/organizations/fabric-ca/mhrd/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-mhrd -M "${PWD}/organizations/peerOrganizations/mhrd.example.com/peers/peer0.mhrd.example.com/msp" --csr.hosts peer0.mhrd.example.com --tls.certfiles "${PWD}/organizations/fabric-ca/mhrd/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/mhrd.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/mhrd.example.com/peers/peer0.mhrd.example.com/msp/config.yaml"

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-mhrd -M "${PWD}/organizations/peerOrganizations/mhrd.example.com/peers/peer0.mhrd.example.com/tls" --enrollment.profile tls --csr.hosts peer0.mhrd.example.com --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/mhrd/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/mhrd.example.com/peers/peer0.mhrd.example.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/mhrd.example.com/peers/peer0.mhrd.example.com/tls/ca.crt"
  cp "${PWD}/organizations/peerOrganizations/mhrd.example.com/peers/peer0.mhrd.example.com/tls/signcerts/"* "${PWD}/organizations/peerOrganizations/mhrd.example.com/peers/peer0.mhrd.example.com/tls/server.crt"
  cp "${PWD}/organizations/peerOrganizations/mhrd.example.com/peers/peer0.mhrd.example.com/tls/keystore/"* "${PWD}/organizations/peerOrganizations/mhrd.example.com/peers/peer0.mhrd.example.com/tls/server.key"

  mkdir -p "${PWD}/organizations/peerOrganizations/mhrd.example.com/msp/tlscacerts"
  cp "${PWD}/organizations/peerOrganizations/mhrd.example.com/peers/peer0.mhrd.example.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/mhrd.example.com/msp/tlscacerts/ca.crt"

  mkdir -p "${PWD}/organizations/peerOrganizations/mhrd.example.com/tlsca"
  cp "${PWD}/organizations/peerOrganizations/mhrd.example.com/peers/peer0.mhrd.example.com/tls/tlscacerts/"* "${PWD}/organizations/peerOrganizations/mhrd.example.com/tlsca/tlsca.mhrd.example.com-cert.pem"

  mkdir -p "${PWD}/organizations/peerOrganizations/mhrd.example.com/ca"
  cp "${PWD}/organizations/peerOrganizations/mhrd.example.com/peers/peer0.mhrd.example.com/msp/cacerts/"* "${PWD}/organizations/peerOrganizations/mhrd.example.com/ca/ca.mhrd.example.com-cert.pem"

  infoln "Generating the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:8054 --caname ca-mhrd -M "${PWD}/organizations/peerOrganizations/mhrd.example.com/users/User1@mhrd.example.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/mhrd/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/mhrd.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/mhrd.example.com/users/User1@mhrd.example.com/msp/config.yaml"

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://mhrdadmin:mhrdadminpw@localhost:8054 --caname ca-mhrd -M "${PWD}/organizations/peerOrganizations/mhrd.example.com/users/Admin@mhrd.example.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/mhrd/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/peerOrganizations/mhrd.example.com/msp/config.yaml" "${PWD}/organizations/peerOrganizations/mhrd.example.com/users/Admin@mhrd.example.com/msp/config.yaml"
}



function createOrderer() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/ordererOrganizations/example.com

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/ordererOrganizations/example.com

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:9054 --caname ca-orderer --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: orderer' > "${PWD}/organizations/ordererOrganizations/example.com/msp/config.yaml"

  infoln "Registering orderer"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name orderer --id.secret ordererpw --id.type orderer --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Registering the orderer admin"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name ordererAdmin --id.secret ordererAdminpw --id.type admin --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  infoln "Generating the orderer msp"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp" --csr.hosts orderer.example.com --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/ordererOrganizations/example.com/msp/config.yaml" "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/config.yaml"

  infoln "Generating the orderer-tls certificates"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls" --enrollment.profile tls --csr.hosts orderer.example.com --csr.hosts localhost --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt"
  cp "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/signcerts/"* "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt"
  cp "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/keystore/"* "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.key"

  mkdir -p "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts"
  cp "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"

  mkdir -p "${PWD}/organizations/ordererOrganizations/example.com/msp/tlscacerts"
  cp "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/tlscacerts/"* "${PWD}/organizations/ordererOrganizations/example.com/msp/tlscacerts/tlsca.example.com-cert.pem"

  infoln "Generating the admin msp"
  set -x
  fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@localhost:9054 --caname ca-orderer -M "${PWD}/organizations/ordererOrganizations/example.com/users/Admin@example.com/msp" --tls.certfiles "${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem"
  { set +x; } 2>/dev/null

  cp "${PWD}/organizations/ordererOrganizations/example.com/msp/config.yaml" "${PWD}/organizations/ordererOrganizations/example.com/users/Admin@example.com/msp/config.yaml"
}
