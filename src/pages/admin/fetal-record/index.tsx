import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

function FetalRecord() {

	const { id } = useParams();

	useEffect(() => {

		console.log("id: ", id);
	}, [])


	return (
		<div>
			<p>api</p>
			<p>{id}</p>
		</div>
	)
}

export default FetalRecord