// walletStore.ts
let ConnectedEthAddress: string | undefined;

export const setConnectedEthAddress = (address?: string) => {
  ConnectedEthAddress = address;
};

export const getConnectedEthAddress = () => ConnectedEthAddress;
