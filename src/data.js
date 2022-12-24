// Current format of ncreview plot data, post-load
const ncData = {
    'A': {
        "labels": ["n","ngood","nmiss","ninf","nnan","nfill","min","max","mean","std"],
        "tooltips": ["Number of samples","Number of good samples","Number of missing samples","Number of infs","Number of nans","Number of fill values","Minimum value","Maximum value","Mean value","Standard deviation"],
        "values": [
            [
                [941760000,1440],
                [941846400,1440],
                [941932800,1440],
                [942019200,1440],
                [942105600,1440],
                [942192000,1440],
                [942278400,1440],
                [942364800,1440],
                [942451200,1440],
                [942537600,1440],
                [942624000,1440],
                [942710400,1440]
            ],
            [
                [941760000,535],
                [941846400,135],
                [941932800,471],
                [942019200,135],
                [942105600,143],
                [942192000,473],
                [942278400,307],
                [942364800,0],
                [942451200,0],
                [942537600,541],
                [942624000,0],
                [942710400,0]
            ],
            [
                [941760000,905],
                [941846400,1305],
                [941932800,969],
                [942019200,1305],
                [942105600,1297],
                [942192000,967],
                [942278400,1133],
                [942364800,1440],
                [942451200,1440],
                [942537600,899],
                [942624000,1440],
                [942710400,1440]
            ],
            [
                [941760000,0],
                [941846400,0],
                [941932800,0],
                [942019200,0],
                [942105600,0],
                [942192000,0],
                [942278400,0],
                [942364800,0],
                [942451200,0],
                [942537600,0],
                [942624000,0],
                [942710400,0]
            ],
            [
                [941760000,0],
                [941846400,0],
                [941932800,0],
                [942019200,0],
                [942105600,0],
                [942192000,0],
                [942278400,0],
                [942364800,0],
                [942451200,0],
                [942537600,0],
                [942624000,0],
                [942710400,0]
            ],
            [
                [941760000,0],
                [941846400,0],
                [941932800,0],
                [942019200,0],
                [942105600,0],
                [942192000,0],
                [942278400,0],
                [942364800,0],
                [942451200,0],
                [942537600,0],
                [942624000,0],
                [942710400,0]
            ],
            [
                [941760000,0.07238748669624329],
                [941846400,0.09200053662061691],
                [941932800,0.07681840658187866],
                [942019200,0.06744470447301865],
                [942105600,0.09776629507541656],
                [942192000,0.06125869229435921],
                [942278400,0.09931500256061554],
                [942364800,null],
                [942451200,null],
                [942537600,0.03072153963148594],
                [942624000,null],
                [942710400,null]
            ],
            [
                [941760000,0.08865215629339218],
                [941846400,0.11693424731492996],
                [941932800,0.10032781958580017],
                [942019200,0.08202824741601944],
                [942105600,0.11028643697500229],
                [942192000,0.08643653988838196],
                [942278400,0.1322203427553177],
                [942364800,null],
                [942451200,null],
                [942537600,0.08269523829221725],
                [942624000,null],
                [942710400,null]
            ],
            [
                [941760000,0.0799179433940727],
                [941846400,0.10426878327572787],
                [941932800,0.0895901312240876],
                [942019200,0.07335949037913923],
                [942105600,0.10202689494911607],
                [942192000,0.06987855672426758],
                [942278400,0.11540387706764357],
                [942364800,null],
                [942451200,null],
                [942537600,0.04816523584401211],
                [942624000,null],
                [942710400,null]
            ],
            [
                [941760000,0.004131328882689066],
                [941846400,0.006076405120024],
                [941932800,0.0043099372885610394],
                [942019200,0.003392459383883914],
                [942105600,0.0027021172965343188],
                [942192000,0.006325444064854105],
                [942278400,0.007703928111101632],
                [942364800,null],
                [942451200,null],
                [942537600,0.01743089119434082],
                [942624000,null],
                [942710400,null]
            ]
        ],
        "interval": 86400,
    },
    'B': undefined
};

// Current MultiLineChart data #1, to check 1 plot alone will display correctly
const plotData_nonDiff = [
    {src: "A", x: 922838400000, y: 77977.04399212688},
    {src: "A", x: 922924800000, y: 9635742.88004772},
    {src: "A", x: 923011200000, y: 8963739.645710848},
    {src: "A", x: 923097600000, y: null},
    {src: "A", x: 923184000000, y: 4583310.710600909},
    {src: "A", x: 923270400000, y: null},
    {src: "A", x: 923356800000, y: 8191582.41823676},
    {src: "A", x: 923443200000, y: null},
    {src: "A", x: 923529600000, y: 9764899.854155261},
    {src: "A", x: 923616000000, y: 6063398.775609355},
    {src: "A", x: 923702400000, y: 499697.9701429663},
    {src: "A", x: 923788800000, y: 4201888.473902466},
    {src: "A", x: 923875200000, y: 1283178.431593222},
    {src: "A", x: 923961600000, y: 9577005.669175332},
    {src: "A", x: 924048000000, y: 7228874.836412981},
    {src: "A", x: 924134400000, y: 446272.93846009986},
    {src: "A", x: 924220800000, y: 6175768.627335324},
    {src: "A", x: 924307200000, y: 6685215.722602747},
    {src: "A", x: 924393600000, y: 2131996.195630685},
    {src: "A", x: 924480000000, y: 759650.7456806751},
    {src: "A", x: 924566400000, y: 5770940.361068491},
    {src: "A", x: 924652800000, y: 2882968.18036039},
    {src: "A", x: 924739200000, y: 4899102.889387707},
    {src: "A", x: 924825600000, y: -823.1669445215},
    {src: "A", x: 924912000000, y: -360.985817116},
    {src: "A", x: 924998400000, y: null},
    {src: "A", x: 925084800000, y: 2074133.0651403957},
    {src: "A", x: 925171200000, y: 496949.3579233603},
    {src: "A", x: 925257600000, y: 124669.96141015721},
    {src: "A", x: 925344000000, y: null},
    {src: "A", x: 925430400000, y: 1785320.597384641},
    {src: "A", x: 925516800000, y: 8043508.273052553},
    {src: "A", x: 925603200000, y: 8791234.136809925},
    {src: "A", x: 925689600000, y: 4645373.826281234},
    {src: "A", x: 925776000000, y: 635822.0258537639},
    {src: "A", x: 925862400000, y: 1665735.482737555},
    {src: "A", x: 925948800000, y: 5576133.240762872},
    {src: "A", x: 926035200000, y: 4669460.6363595575},
    {src: "A", x: 926121600000, y: 5697845.610577158},
    {src: "A", x: 926208000000, y: 2270460.027841799},
    {src: "A", x: 926294400000, y: 6853734.524990606},
    {src: "A", x: 926380800000, y: 814135.3071805238},
    {src: "A", x: 926467200000, y: 7747883.707717112},
    {src: "A", x: 926553600000, y: 7936738.229849208},
    {src: "A", x: 926640000000, y: 1516001.2671212985},
    {src: "A", x: 926726400000, y: 8245033.984486399},
    {src: "A", x: 926812800000, y: 3856716.210135836},
    {src: "A", x: 926899200000, y: null},
    {src: "A", x: 926985600000, y: null},
    {src: "A", x: 927072000000, y: null},
];

// Current MultiLineChart data #2, to check 2 plots will display correctly
const plotData_diff = [
    {src: "A", x: 922838400000, y: 77977.04399212688},
    {src: "A", x: 922924800000, y: 9635742.88004772},
    {src: "A", x: 923011200000, y: 8963739.645710848},
    {src: "A", x: 923097600000, y: null},
    {src: "A", x: 923184000000, y: 4583310.710600909},
    {src: "A", x: 923270400000, y: null},
    {src: "A", x: 923356800000, y: 8191582.41823676},
    {src: "A", x: 923443200000, y: null},
    {src: "A", x: 923529600000, y: 9764899.854155261},
    {src: "A", x: 923616000000, y: 6063398.775609355},
    {src: "A", x: 923702400000, y: 499697.9701429663},
    {src: "A", x: 923788800000, y: 4201888.473902466},
    {src: "A", x: 923875200000, y: 1283178.431593222},
    {src: "A", x: 923961600000, y: 9577005.669175332},
    {src: "A", x: 924048000000, y: 7228874.836412981},
    {src: "A", x: 924134400000, y: 446272.93846009986},
    {src: "A", x: 924220800000, y: 6175768.627335324},
    {src: "A", x: 924307200000, y: 6685215.722602747},
    {src: "A", x: 924393600000, y: 2131996.195630685},
    {src: "A", x: 924480000000, y: 759650.7456806751},
    {src: "A", x: 924566400000, y: 5770940.361068491},
    {src: "A", x: 924652800000, y: 2882968.18036039},
    {src: "A", x: 924739200000, y: 4899102.889387707},
    {src: "A", x: 924825600000, y: -823.1669445215},
    {src: "A", x: 924912000000, y: -360.985817116},
    {src: "A", x: 924998400000, y: null},
    {src: "A", x: 925084800000, y: 2074133.0651403957},
    {src: "A", x: 925171200000, y: 496949.3579233603},
    {src: "A", x: 925257600000, y: 124669.96141015721},
    {src: "A", x: 925344000000, y: null},
    {src: "A", x: 925430400000, y: 1785320.597384641},
    {src: "A", x: 925516800000, y: 8043508.273052553},
    {src: "A", x: 925603200000, y: 8791234.136809925},
    {src: "A", x: 925689600000, y: 4645373.826281234},
    {src: "A", x: 925776000000, y: 635822.0258537639},
    {src: "A", x: 925862400000, y: 1665735.482737555},
    {src: "A", x: 925948800000, y: 5576133.240762872},
    {src: "A", x: 926035200000, y: 4669460.6363595575},
    {src: "A", x: 926121600000, y: 5697845.610577158},
    {src: "A", x: 926208000000, y: 2270460.027841799},
    {src: "A", x: 926294400000, y: 6853734.524990606},
    {src: "A", x: 926380800000, y: 814135.3071805238},
    {src: "A", x: 926467200000, y: 7747883.707717112},
    {src: "A", x: 926553600000, y: 7936738.229849208},
    {src: "A", x: 926640000000, y: 1516001.2671212985},
    {src: "A", x: 926726400000, y: 8245033.984486399},
    {src: "A", x: 926812800000, y: 3856716.210135836},
    {src: "A", x: 926899200000, y: null},
    {src: "A", x: 926985600000, y: null},
    {src: "A", x: 927072000000, y: null},

    {src: "B", x: 922838400000, y: -77977.04399212688},
    {src: "B", x: 922924800000, y: -9635742.88004772},
    {src: "B", x: 923011200000, y: -8963739.645710848},
    {src: "B", x: 923097600000, y: null},
    {src: "B", x: 923184000000, y: 4583310.710600909},
    {src: "B", x: 923270400000, y: null},
    {src: "B", x: 923356800000, y: 8191582.41823676},
    {src: "B", x: 923443200000, y: null},
    {src: "B", x: 923529600000, y: 9764899.854155261},
    {src: "B", x: 923616000000, y: 6063398.775609355},
    {src: "B", x: 923702400000, y: 499697.9701429663},
    {src: "B", x: 923788800000, y: 4201888.473902466},
    {src: "B", x: 923875200000, y: 1283178.431593222},
    {src: "B", x: 923961600000, y: 9577005.669175332},
    {src: "B", x: 924048000000, y: 7228874.836412981},
    {src: "B", x: 924134400000, y: 446272.93846009986},
    {src: "B", x: 924220800000, y: 6175768.627335324},
    {src: "B", x: 924307200000, y: 6685215.722602747},
    {src: "B", x: 924393600000, y: 2131996.195630685},
    {src: "B", x: 924480000000, y: 759650.7456806751},
    {src: "B", x: 924566400000, y: 5770940.361068491},
    {src: "B", x: 924652800000, y: 2882968.18036039},
    {src: "B", x: 924739200000, y: 4899102.889387707},
    {src: "B", x: 924825600000, y: -822.1669445215},
    {src: "B", x: 924998400000, y: null},
    {src: "B", x: 924912000000, y: 360567.985817116},
    {src: "B", x: 925084800000, y: 2074133.0651403957},
    {src: "B", x: 925171200000, y: 496949.3579233603},
    {src: "B", x: 925257600000, y: 124669.96141015721},
    {src: "B", x: 925344000000, y: null},
    {src: "B", x: 925430400000, y: 1755320.597384641},
    {src: "B", x: 925516800000, y: 8043508.273052553},
    {src: "B", x: 925603200000, y: 8791222.136809925},
    {src: "B", x: 925689600000, y: 4645373.826245234},
    {src: "B", x: 925776000000, y: 635822.0258537639},
    {src: "B", x: 925862400000, y: 1665712.482737555},
    {src: "B", x: 925948800000, y: 5576133.241762872},
    {src: "B", x: 926035200000, y: 4669460.6378595575},
    {src: "B", x: 926121600000, y: 5697245.610577158},
    {src: "B", x: 926208000000, y: 2270468.027841799},
    {src: "B", x: 926294400000, y: 6858734.524990606},
    {src: "B", x: 926380800000, y: 1014135.3071805238},
    {src: "B", x: 926467200000, y: 7747882.707717112},
    {src: "B", x: 926553600000, y: 7936738.229849208},
    {src: "B", x: 926640000000, y: 1516001.2671212985},
    {src: "B", x: 926726400000, y: 8245031.884486399},
    {src: "B", x: 926812800000, y: null},
    {src: "B", x: 926899200000, y: null},
    {src: "B", x: 926985600000, y: null},
    {src: "B", x: 927072000000, y: null}
];

// Current LineChart data
const plotData_1 = {
    'A': [
        [922838400000, 77977.04399212688],
        [922924800000, 9635742.88004772],
        [923011200000, 8963739.645710848],
        [923097600000, null],
        [923184000000, 4583310.710600909],
        [923270400000, null],
        [923356800000, 8191582.41823676],
        [923443200000, null],
        [923529600000, 9764899.854155261],
        [923616000000, 6063398.775609355],
        [923702400000, 499697.9701429663],
        [923788800000, 4201888.473902466],
        [923875200000, 1283178.431593222],
        [923961600000, 9577005.669175332],
        [924048000000, 7228874.836412981],
        [924134400000, 446272.93846009986],
        [924220800000, 6175768.627335324],
        [924307200000, 6685215.722602747],
        [924393600000, 2131996.195630685],
        [924480000000, 759650.7456806751],
        [924566400000, 5770940.361068491],
        [924652800000, 2882968.18036039],
        [924739200000, 4899102.889387707],
        [924825600000, -823.1669445215],
        [924912000000, -360.985817116],
        [924998400000, null],
        [925084800000, 2074133.0651403957],
        [925171200000, 496949.3579233603],
        [925257600000, 124669.96141015721],
        [925344000000, null],
        [925430400000, 1785320.597384641],
        [925516800000, 8043508.273052553],
        [925603200000, 8791234.136809925],
        [925689600000, 4645373.826281234],
        [925776000000, 635822.0258537639],
        [925862400000, 1665735.482737555],
        [925948800000, 5576133.240762872],
        [926035200000, 4669460.6363595575],
        [926121600000, 5697845.610577158],
        [926208000000, 2270460.027841799],
        [926294400000, 6853734.524990606],
        [926380800000, 814135.3071805238],
        [926467200000, 7747883.707717112],
        [926553600000, 7936738.229849208],
        [926640000000, 1516001.2671212985],
        [926726400000, 8245033.984486399],
        [926812800000, 3856716.210135836],
        [926899200000, null],
        [926985600000, null],
        [927072000000, null]
    ],
    'B': [
        [922838400000, 77977.04399212688],
        [922924800000, 9635742.88004772],
        [923011200000, 8963739.645710848],
        [923097600000, null],
        [923184000000, 4583310.710600909],
        [923270400000, null],
        [923356800000, 8191582.41823676],
        [923443200000, null],
        [923529600000, 9764899.854155261],
        [923616000000, 6063398.775609355],
        [923702400000, 499697.9701429663],
        [923788800000, 4201888.473902466],
        [923875200000, 1283178.431593222],
        [923961600000, 9577005.669175332],
        [924048000000, 7228874.836412981],
        [924134400000, 446272.93846009986],
        [924220800000, 6175768.627335324],
        [924307200000, 6685215.722602747],
        [924393600000, 2131996.195630685],
        [924480000000, 759650.7456806751],
        [924566400000, 5770940.361068491],
        [924652800000, 2882968.18036039],
        [924739200000, 4899102.889387707],
        [924825600000, -822.1669445215],
        [924998400000, null],
        [924912000000, 360567.985817116],
        [925084800000, 2074133.0651403957],
        [925171200000, 496949.3579233603],
        [925257600000, 124669.96141015721],
        [925344000000, null],
        [925430400000, 1755320.597384641],
        [925516800000, 8043508.273052553],
        [925603200000, 8791222.136809925],
        [925689600000, 4645373.826245234],
        [925776000000, 635822.0258537639],
        [925862400000, 1665712.482737555],
        [925948800000, 5576133.241762872],
        [926035200000, 4669460.6378595575],
        [926121600000, 5697245.610577158],
        [926208000000, 2270468.027841799],
        [926294400000, 6858734.524990606],
        [926380800000, 1014135.3071805238],
        [926467200000, 7747882.707717112],
        [926553600000, 7936738.229849208],
        [926640000000, 1516001.2671212985],
        [926726400000, 8245031.884486399],
        [926812800000, null],
        [926899200000, null],
        [926985600000, null],
        [927072000000, null]
    ]
};

// Original LineChart data
// NOTE: Have to change "plotData.A" to "plotData" to use.
const lineChartData = [
    [922838400000, 77977.04399212688],
    [922924800000, 9635742.88004772],
    [923011200000, 8963739.645710848],
    [923097600000, null],
    [923184000000, 4583310.710600909],
    [923270400000, null],
    [923356800000, 8191582.41823676],
    [923443200000, null],
    [923529600000, 9764899.854155261],
    [923616000000, 6063398.775609355],
    [923702400000, 499697.9701429663],
    [923788800000, 4201888.473902466],
    [923875200000, 1283178.431593222],
    [923961600000, 9577005.669175332],
    [924048000000, 7228874.836412981],
    [924134400000, 446272.93846009986],
    [924220800000, 6175768.627335324],
    [924307200000, 6685215.722602747],
    [924393600000, 2131996.195630685],
    [924480000000, 759650.7456806751],
    [924566400000, 5770940.361068491],
    [924652800000, 2882968.18036039],
    [924739200000, 4899102.889387707],
    [924825600000, -823.1669445215],
    [924912000000, -360.985817116],
    [924998400000, null],
    [925084800000, 2074133.0651403957],
    [925171200000, 496949.3579233603],
    [925257600000, 124669.96141015721],
    [925344000000, null],
    [925430400000, 1785320.597384641],
    [925516800000, 8043508.273052553],
    [925603200000, 8791234.136809925],
    [925689600000, 4645373.826281234],
    [925776000000, 635822.0258537639],
    [925862400000, 1665735.482737555],
    [925948800000, 5576133.240762872],
    [926035200000, 4669460.6363595575],
    [926121600000, 5697845.610577158],
    [926208000000, 2270460.027841799],
    [926294400000, 6853734.524990606],
    [926380800000, 814135.3071805238],
    [926467200000, 7747883.707717112],
    [926553600000, 7936738.229849208],
    [926640000000, 1516001.2671212985],
    [926726400000, 8245033.984486399],
    [926812800000, 3856716.210135836],
    [926899200000, null],
    [926985600000, null],
    [927072000000, null]
];

//export const data = plotData_nonDiff; // LineChart
export const data = plotData_diff; // MultiLineChart
