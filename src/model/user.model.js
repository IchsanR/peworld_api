const db = require("../config/db");

const userModel = {
	// router list
	selectAll: () => {
		return new Promise((resolve, reject) => {
			db.query("SELECT * FROM users", (err, res) => {
				if (err) {
					reject(err);
				}
				resolve(res);
			});
		});
	},
	// router - detail
	selectDetail: (id_user) => {
		return new Promise((resolve, reject) => {
			db.query(
				`SELECT * FROM users where id_user = '${id_user}'`,
				(err, res) => {
					if (err) {
						reject(err);
					}
					resolve(res);
				}
			);
		});
	},
	selectName: (names, limit, offset) => {
		return new Promise((resolve, reject) => {
			db.query(
				`SELECT * FROM users where names ilike '%${names}%' LIMIT ${limit} OFFSET ${offset}`,
				(err, res) => {
					if (err) {
						reject(err);
					}
					resolve(res);
				}
			);
		});
	},

	// countUser: (names) => {
	// 	return new Promise((resolve, reject) => {
	// 		pool.query(
	// 			`SELECT COUNT(*) AS total FROM users where names ilike '%${names}%'`,
	// 			(err, res) => {
	// 				if (err) {
	// 					reject(err);
	// 				}
	// 				resolve(res);
	// 			}
	// 		);
	// 	});
	// },

	// router - register
	register: ({
		id_user,
		names,
		email,
		password,
		phone,
		level,
		profile_pic,
		picture_link,
	}) => {
		return new Promise((resolve, reject) => {
			db.query(
				`INSERT INTO users (id_user, names, email, password, phone, level, profile_pic, picture_link)
      VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8)`,
				[
					id_user,
					names,
					email,
					password,
					phone,
					level,
					profile_pic,
					picture_link,
				],
				(err, res) => {
					if (err) {
						reject(err);
					}
					resolve(res);
				}
			);
		});
	},
	// login
	checkEmail: (email) => {
		return new Promise((resolve, reject) => {
			db.query(
				`
        SELECT * FROM users WHERE email = '${email}'
        `,
				(err, res) => {
					if (err) {
						reject(err);
					}
					resolve(res);
				}
			);
		});
	},

	update: ({
		id_user,
		names,
		job_desc,
		domisili,
		tempat_kerja,
		description,
	}) => {
		return new Promise((resolve, reject) => {
			db.query(
				`
        UPDATE users SET
        names = COALESCE ($1, names),
        job_desc = COALESCE ($2, job_desc),
        domisili = COALESCE ($3, domisili),
        tempat_kerja = COALESCE ($4, tempat_kerja),
        description = COALESCE ($5, description)
        WHERE id_user = $6
        `,
				[names, job_desc, domisili, tempat_kerja, description, id_user],
				(err, res) => {
					if (err) {
						reject(err);
					}
					resolve(res);
				}
			);
		});
	},
	updatePass: ({ email, password }) => {
		return new Promise((resolve, reject) => {
			db.query(
				`
      UPDATE users SET password = '${password}' WHERE email = ${email}`,
				(err, res) => {
					if (err) {
						reject(err);
					}
					resolve(res);
				}
			);
		});
	},
	updateImage: ({ id_user, profile_pic, profile_link }) => {
		return new Promise((resolve, reject) => {
			db.query(
				`
			UPDATE users SET 
			profile_pic = COALESCE ($1, profile_pic), 
			profile_link = COALESCE ($2, profile_link), 
			WHERE id_user = $3`,
				[id_user, profile_pic, profile_link],
				(err, res) => {
					if (err) {
						reject(err);
					}
					resolve(res);
				}
			);
		});
	},
	destroy: (id) => {
		return new Promise((resolve, reject) => {
			db.query(
				`
      DELETE FROM users WHERE id_user = '${id}'
      `,
				(err, res) => {
					if (err) {
						reject(err);
					}
					resolve(res);
				}
			);
		});
	},
};

module.exports = userModel;
