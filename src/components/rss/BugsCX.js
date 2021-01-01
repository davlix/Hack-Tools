import React from 'react';
import { Typography, Empty, Spin, Button, List, PageHeader, Tag } from 'antd';
import QueueAnim from 'rc-queue-anim';
import { goTo } from 'react-chrome-extension-router';
import { useQuery } from 'react-query';
import CxsecurityChoose from './CxsecurityChoose';

const { Title } = Typography;

const fetchApi = async () => {
	const res = await fetch(
		'https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fcxsecurity.com%2Fwlb%2Frss%2Fvulnerabilities%2F&api_key=cpe1hekkfknhpeqov1hvcojojd9csg01yqybwsaw&count=20'
	);
	return res.json();
};

export default (props) => {
	const { data, status, error } = useQuery('cisco', fetchApi);

	return (
		<QueueAnim delay={300} duration={1500}>
			<PageHeader
				onBack={() => goTo(CxsecurityChoose)}
				title='Vulnerabilities Database'
				subTitle='World Laboratory of Bugtraq 2 CXSecurity.com'
			/>
			{status === 'loading' && (
				<div style={{ textAlign: 'center' }}>
					<Spin />
					<Empty />
				</div>
			)}
			{status === 'error' && (
				<React.Fragment>
					<Empty
						image='https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg'
						imageStyle={{
							height: 60
						}}
						description={<span>Error getting the data please contact us.</span>}
					>
						<pre>{error.message}</pre>
						<Button danger>
							<a
								href='https://github.com/LasCC/Hack-Tools/issues'
								rel='noreferrer noopener'
								target='_blank'
							>
								Report the bug
							</a>
						</Button>
					</Empty>
				</React.Fragment>
			)}
			{status === 'success' && (
				<div
					key='a'
					style={{
						padding: 15
					}}
				>
					<Title
						variant='Title level={4}'
						style={{
							fontWeight: 'bold',
							marginTop: 15
						}}
					>
						Recent Vulnerabilities
					</Title>
					<List
						itemLayout='horizontal'
						dataSource={data.items}
						style={{ marginTop: 15 }}
						renderItem={(list) => (
							<List.Item
								actions={[
									<div>
										{(() => {
											const severityLevel = list.content.match(/Risk: (\w{1,})/)[1];
											console.log(severityLevel);
											switch (severityLevel) {
												case 'High':
													return <Tag color='red'>{severityLevel}</Tag>;
												case 'Medium':
													return <Tag color='orange'>{severityLevel}</Tag>;
												case 'Low':
													return <Tag color='green'>{severityLevel}</Tag>;
												default:
													break;
											}
										})()}
									</div>,
									<Tag color='geekblue' style={{ marginLeft: 5 }}>
										{list.author}
									</Tag>
								]}
							>
								<a href={list.link} alt='exploit_db_link' target='_blank' rel='noreferrer noopener'>
									{list.title}
								</a>
							</List.Item>
						)}
					/>
				</div>
			)}
		</QueueAnim>
	);
};