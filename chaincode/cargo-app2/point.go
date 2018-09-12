
 package main

 import (
	 "encoding/json"
	 "strconv"
   "fmt"
	 "github.com/hyperledger/fabric/core/chaincode/shim"
	 "github.com/hyperledger/fabric/protos/peer"
 )

//peer chaincode query -n cargo-app -c '{"Args":["queryPoint", "USER.kim"]}' -C mychannel
/********************************************************
	 args[0] - 계정명
	 특정 계정의 포인트를 조회 메소드
	**********************************************************/
 func (s *SmartContract) queryPoint(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	cargoAsBytes, _ := stub.GetState(args[0])
	// cargoAsBytes, _ := stub.GetState(args[0])
	if cargoAsBytes == nil {
		return shim.Error("Could not locate tuna")
	}
  fmt.Println(string(cargoAsBytes))
	return shim.Success(cargoAsBytes)
}

/********************************************************
	 args[0] - 계정명
	 특정 계정의 포인트를 추가하는 메소드
	**********************************************************/
// peer chaincode invoke -n cargo-app -c '{"Args":["addPoint", "USER.kim", "100"]}' -C mychannel
func (t *SmartContract) addPoint(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	key := args[0]
	pointAsBytes, _ := stub.GetState(key)
	point := PointContract{}

	json.Unmarshal(pointAsBytes, &point)
    val, _ := strconv.Atoi(args[1])
	point.Total += val

	pointAsBytes, _ = json.Marshal(point)
	stub.PutState(key, pointAsBytes)

	return shim.Success(nil)
}

/**
유저생성 메소드
args[0] == 유저아이디
args[1] == 유저이름
**/

func (t *SmartContract) createUser(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	key := args[0]
	point := PointContract{Username:args[1],Total:0}

	pointAsBytes, _ := json.Marshal(point)
	stub.PutState(key, pointAsBytes)

	return shim.Success(nil)
}


/********************************************************
	 args[0] - 계정명
	 특정 계정의 포인트를 빼는 메소드
	**********************************************************/
func (t *SmartContract) subtractPoint(stub shim.ChaincodeStubInterface, args []string) peer.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}
	key := args[0]
	pointAsBytes, _ := stub.GetState(key)
	point := PointContract{}

	json.Unmarshal(pointAsBytes, &point)
    val, _ := strconv.Atoi(args[1])
	point.Total -= val

	pointAsBytes, _ = json.Marshal(point)
	stub.PutState(key, pointAsBytes)

	return shim.Success(nil)
}
