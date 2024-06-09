import * as statisticalService from '../services/statistical.js'

export const calculateAverageRentByPostId = async (req, res) => {
    const { postId } = req.query;

    try {
        if (!postId) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing postId input'
            });
        }

        const response = await statisticalService.calculateAverageRentByPostIdService(postId);
        return res.status(200).json(response);

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        });
    }
};

export const calculateAverageRentByAllProvince = async (req, res) => {
    const { postId } = req.query;

    try {
        const response = await statisticalService.calculateAverageRentByAllProvinceService(postId);
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        });
    }
};


export const calculateAverageRentByProvinceAndDate = async (req, res) => {
    const { postId, year } = req.query;

    try {
        if (!postId) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing postId input'
            });
        }

        if (!year) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing year input'
            });
        }

        const response = await statisticalService.calculateAverageRentByProvinceAndDateService(postId, year);
        return res.status(200).json(response);

    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at post controller: ' + error
        });
    }
};

export const compareAverageRentByYear = async (req, res) => {
    const { postId } = req.query;

    try {
        // Tính giá trung bình trong năm 2023
        const response2023 = await statisticalService.calculateAverageRentByProvinceAndDateService(postId, 2023);
        if (response2023.err !== 0) {
            return res.status(400).json({
                err: 1,
                msg: 'Failed to calculate average rent for 2023'
            });
        }
        const averageRent2023 = response2023.averageRentByMonth;

        // Tính giá trung bình trong năm 2024
        const response2024 = await statisticalService.calculateAverageRentByProvinceAndDateService(postId, 2024);
        if (response2024.err !== 0) {
            return res.status(400).json({
                err: 1,
                msg: 'Failed to calculate average rent for 2024'
            });
        }
        const averageRent2024 = response2024.averageRentByMonth;

        // Tính tổng giá trung bình của cả năm 2023 và 2024
        let totalRent2023 = 0;
        let totalRent2024 = 0;
        let count2023 = 0;
        let count2024 = 0;

        for (let month = 1; month <= 12; month++) {
            if (averageRent2023[month]) {
                totalRent2023 += averageRent2023[month];
                count2023++;
            }
            if (averageRent2024[month]) {
                totalRent2024 += averageRent2024[month];
                count2024++;
            }
        }

        // Tính giá trung bình của cả năm 2023 và 2024
        const averageRent2023Total = totalRent2023 / count2023;
        const averageRent2024Total = totalRent2024 / count2024;

        // Tính tỉ lệ tăng/giảm trung bình của cả năm
        const rentChange = ((averageRent2024Total - averageRent2023Total) / averageRent2023Total) * 100;

        // Xác định xem giá thuê tăng lên hay giảm xuống và tỉ lệ tăng/giảm mấy phần trăm
        let trend = "";
        if (rentChange > 0) {
            trend = "tăng";
        } else if (rentChange < 0) {
            trend = "giảm";
        } else {
            trend = "không thay đổi";
        }

        return res.status(200).json({
            err: 0,
            msg: 'Comparison completed successfully',
            trend: trend,
            rentChange: Math.abs(rentChange).toFixed(2) + '%'
        });
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: 'Failed at comparison controller: ' + error
        });
    }
};

