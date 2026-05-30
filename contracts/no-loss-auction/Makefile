include .env
default: build

all: test

test: build
	cargo test

build:
	stellar contract build
	@ls -l ../../target/wasm32v1-none/release/*.wasm

fmt:
	cargo fmt --all

clean:
	cargo clean

upload:
	stellar contract upload \
    --source-account ${source-account} \
    --network testnet \
	--wasm ../../target/wasm32v1-none/release/no_loss_auction.wasm

get-token:
	stellar contract id asset --asset native --network testnet
	
deploy:
	stellar contract deploy \
    --source-account ${source-account} \
    --network testnet \
	--wasm-hash ${wasm-hash} \
	-- \
	--admin ${admin} \
	--token ${token}