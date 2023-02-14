import useComponentState from "./useComponentState";

const useFlyerInfo = () => {

    const {state:flyerInfo, handleStateByObject: handleFlyerInfo } = useComponentState<FlyerInfo>({
        flyerId: '',
        file: null,
        spotNames: [],
        spotIds: [],
        searchSpotCondition: '',
    })

    return {flyerInfo, handleFlyerInfo};
}
 
export default useFlyerInfo;

export type FlyerInfo = {
    flyerId: string,
    file: any,
    spotNames: string[],
    spotIds: number[],
    searchSpotCondition: string
}