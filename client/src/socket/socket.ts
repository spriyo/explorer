import { io } from "socket.io-client";

export const socket = io("http://localhost:3003/");

socket.on("connect", () => {
	console.log(socket.id); // x8WIv7-mJelg7on_ALbx
});

socket.on("disconnect", () => {
	console.log("Socket Disconnected"); // undefined
});

socket.on("new-block", (block) => {
	// currentBlock.innerText = block;
});

socket.on("save-nft", (count) => {
	// savedNFTS.innerText = count + currentNFTCount;
});

socket.on("indexing-block", (block) => {
	// indexingBlock.innerText = block;
});
