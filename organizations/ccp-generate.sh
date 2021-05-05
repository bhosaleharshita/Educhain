#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.json
}

function yaml_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${P0PORT}/$2/" \
        -e "s/\${CAPORT}/$3/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

ORG=uni
P0PORT=7051
CAPORT=7054
PEERPEM=organizations/peerOrganizations/uni.example.com/tlsca/tlsca.uni.example.com-cert.pem
CAPEM=organizations/peerOrganizations/uni.example.com/ca/ca.uni.example.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/uni.example.com/connection-uni.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/uni.example.com/connection-uni.yaml
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > Application/organization/uni/gateway/connection-uni.yaml

ORG=mhrd
P0PORT=9051
CAPORT=8054
PEERPEM=organizations/peerOrganizations/mhrd.example.com/tlsca/tlsca.mhrd.example.com-cert.pem
CAPEM=organizations/peerOrganizations/mhrd.example.com/ca/ca.mhrd.example.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/mhrd.example.com/connection-mhrd.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/mhrd.example.com/connection-mhrd.yaml
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > Application/organization/mhrd/gateway/connection-mhrd.yaml


ORG=thirdparty
P0PORT=11051
CAPORT=11054
PEERPEM=organizations/peerOrganizations/thirdparty.example.com/tlsca/tlsca.thirdparty.example.com-cert.pem
CAPEM=organizations/peerOrganizations/thirdparty.example.com/ca/ca.thirdparty.example.com-cert.pem

echo "$(json_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/thirdparty.example.com/connection-thirdparty.json
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/thirdparty.example.com/connection-thirdparty.yaml
echo "$(yaml_ccp $ORG $P0PORT $CAPORT $PEERPEM $CAPEM)" > Application/organization/thirdparty/gateway/connection-thirdparty.yaml

